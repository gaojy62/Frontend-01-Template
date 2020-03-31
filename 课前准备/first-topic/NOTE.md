## 父子页面之间操作 dom 的方法

### 父页面操作子页面

> 获取父页面 id 为 my-frame 的 iframe，并且在 my-frame 页面的 body 中添加 dom

- contentWindow

  `contentWindow`以 window 对象返回 iframe 中的文档，所有主流浏览器都支持。

  ```js
  document.getElementById('my-frame').contentWindow.document.body.append(dom)
  ```

- contentDocument

  `contentDocument`以 document 对象返回 iframe 中的文档，IE8 以下的浏览器不支持

  ```js
  document.getElementById('my-frame').contentDocument.body.append(dom)
  ```

- window.frames

  `window.frames[iframeName]`通过 iframe 的 name 属性获取 iframe 内容
  `window.frames[iframeIndex]`通过 iframe 的 索引获取 iframe 内容

  ```js
  window.frames['iframeName'].document.body.append(dom)
  window.frames[0].document.body.append(dom)
  ```

### 子页面操作父页面的 dom

- 子页面可以通过`window.parent`或者`window.top`实现，parent 代表父页面，top 代表顶级页面

  ```js
  window.parent.document.body.append(dom)
  ```

