# 第九周总结

## DOM

### 导航类操作

- parentNode
- childNodes
- firstChild
- lastChild
- nextSibling
- previousSibling

childNodes 是一个 living collections 对 dom 树的操作都会实时反应到 childNodes 中

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

所有 dom 节点默认只有一个父元素，如果 append 一个 dom 节点两次，在第二次 append 操作的时候会默认先删除第一次的 append 的节点

### 高级操作

- compareDocumentPosition 是一个用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用“===”
- cloneNode 复制一个节点，如果传入参数 true，则会连同子元素做深拷贝

### 普通方法

- createElement
- createTextNode
- createCDATASection
- createComment
- createProcessingInstruction
- createDocumentFragment
- createDocumentType

### Event

EventTarget.addEventListener(type, listener, options)
> listener 可以传一个对象 `{handleEvent: function(){}}`
> options 一个指定有关 listener 属性的可选参数[对象](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

- 捕获
- 冒泡
