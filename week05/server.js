const http = require('http')

const server = http.createServer((req, res) => {
  console.log('request received')
  console.log(req.headers)

  res.setHeader('X-Foo', 'bar')
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  // res.end('only some letters')
  res.end('传输一些汉字和一些 letters 𠀃𠀀𠀂')
})

server.listen(8088)
