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

module.exports = ResponseParse