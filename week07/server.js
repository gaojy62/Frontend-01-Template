const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  const fileName = path.resolve(__dirname, './test.html')
  console.log('request received')
  console.log(req.headers)

  res.setHeader('Content-Type', 'text/html')
  res.setHeader('X-Foo', 'bar')
  res.writeHead(200, { 'Content-Type': 'text/html' })

  fs.readFile(fileName, (err, data) => {
    res.end(data)
  })
})

server.listen(8088)
