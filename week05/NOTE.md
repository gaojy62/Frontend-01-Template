# 浏览器工作原理

在浏览器中输入url后，浏览器发生了什么

1. 浏览器从URL中解析出主机名
2. DNS解析
3. 获取端口号
4. 浏览器建立到 IP:PORT 的连接
5. 浏览器发送请求
6. 浏览器读取服务器的HTTP响应
7. parse响应的body部分形成DOM树
8. css computing形成CSSOM
9. 排版并渲染

OSI七层协议

1. 物理层
2. 数据链路层
3. 网络层
4. 传输层
5. 会话层
6. 表示层
7. 应用层

HTTP、HTTPS属于应用层协议，TCP、UDP属于传输层协议，IP属于网络层协议

IP协议对于node来说是透明的，node通过`require('net')`使用TCP协议，通过`require('http')`使用HTTP协议
