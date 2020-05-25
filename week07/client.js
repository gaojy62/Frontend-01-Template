const net = require('net')
const images = require('images')

const ResponseParse = require('./parseHTTP.js')
const parse = require('./parseHtml.js')

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