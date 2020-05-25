const net = require('net')
const parse = require('./parseHtml.js')
const images = require('images')

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (
      this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join('\r\n')}
\r
${this.bodyText}`
  }
  send(connection) {
    const parseHeader = new ResponseParse()
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString())
          }
        )
      }
      connection.on('data', (data) => {
        parseHeader.receive(data.toString())
        if (parseHeader.isFinished) {
          resolve(parseHeader.response)
          connection.end()
        }
      })
      connection.on('error', (err) => {
        reject(err)
        connection.end()
      })
    })
  }
}

class ResponseParse {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1

    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_STATUS_BLOCK_END = 6

    this.WAITING_BODY = 7

    this.currentStatus = this.WAITING_STATUS_LINE
    this.statusLine = ''
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.bodyPares = null
  }
  get isFinished() {
    return this.bodyPares && this.bodyPares.isFinished
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyPares.content.join(''),
    }
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(char) {
    if (this.currentStatus === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    } else if (this.currentStatus === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_HEADER_NAME
      } else {
        console.log('http报文起始行格式不正确')
      }
    } else if (this.currentStatus === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.currentStatus = this.WAITING_HEADER_SPACE
      } else if (char === '\r') {
        this.currentStatus = this.WAITING_STATUS_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyPares = new TrunkedBodyParse()
        } else if (this.headers['Content-Type'] === 'text/html') {
          this.bodyPares = new TrunkedBodyParse()
        }
      } else {
        this.headerName += char
      }
    } else if (this.currentStatus === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.currentStatus = this.WAITING_HEADER_VALUE
      } else {
        console.log('http报文headerValue前少了一个空格')
      }
    } else if (this.currentStatus === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_HEADER_LINE_END
      } else {
        this.headerValue += char
      }
    } else if (this.currentStatus === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_HEADER_NAME
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        console.log('http 报文 header格式错误')
      }
    } else if (this.currentStatus === this.WAITING_STATUS_BLOCK_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_BODY
      }
    } else if (this.currentStatus === this.WAITING_BODY) {
      this.bodyPares.receiveChar(char)
    }
  }
}

class TrunkedBodyParse {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNKED = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.lengthString = '0x'
    this.length = 0
    this.content = []
    this.currentStatus = this.WAITING_LENGTH
    this.isFinished = false
  }

  // getCharLength(char){
  //   return char.replace(/[^\u0000-\u00ff]/g,'aaa').length
  // }

  getCode(code) {
    if (code <= 0x7f) {
      return [code]
    } else if (code >= 0x80 && code <= 0x7ff) {
      return [
        0b11000000 | ((code >> 6) & 0b11111),
        0b10000000 | (code & 0b111111),
      ]
    } else if (code >= 0x800 && code <= 0xffff) {
      return [
        0b11100000 | ((code >> 12) & 0b1111),
        0b10000000 | ((code >> 6) & 0b111111),
        0b10000000 | (code & 0b111111),
      ]
    } else if (code >= 0x10000 && code <= 0x10ffff) {
      return [
        0b11110000 | ((code >> 18) & 0b111),
        0b10000000 | ((code >> 12) & 0b111111),
        0b10000000 | ((code >> 6) & 0b111111),
        0b10000000 | (code & 0b111111),
      ]
    }
  }

  receiveChar(char) {
    if (this.currentStatus === this.WAITING_LENGTH) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_LENGTH_LINE_END
      } else {
        this.lengthString += char
      }
    } else if (this.currentStatus === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.length = Number(this.lengthString)
        if (this.length === 0) {
          this.isFinished = true
        }
        this.lengthString = '0x'
        this.currentStatus = this.READING_TRUNKED
      } else {
        console.log('body解析错误')
      }
    } else if (this.currentStatus === this.READING_TRUNKED) {
      if (this.length > 0) {
        this.content.push(char)
        let charLength = this.getCode(char.codePointAt(0)).length
        this.length -= charLength
      }
      if (this.length === 0) {
        this.currentStatus = this.WAITING_NEW_LINE
      }
    } else if (this.currentStatus === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_NEW_LINE_END
      }
    } else if (this.currentStatus === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_LENGTH
      }
    }
  }
}

void (async function () {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    path: '/',
    body: {
      name: 'gao',
    },
  })
  let response = await request.send()
  let html = parse.parseHtml(response.body)

  let viewport = images(800, 600)
  render(viewport, html)
  viewport.save('viewport.png')
})()

function render(viewport, element) {
  if (element.style) {
    let img = images(element.style.width, element.style.height)

    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rgb(0,0,0)'
      color.match(/rgb\(([ ]*\d+),([ ]*\d+),([ ]*\d+)\)/)
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1)
      viewport.draw(img, element.style.left || 0, element.style.top || 0)
    }
  }

  if (element.children) {
    for (let child of element.children) {
      render(viewport, child)
    }
  }
}
