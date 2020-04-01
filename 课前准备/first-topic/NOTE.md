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

### 移动 dom

> 只想到一种修改 dom 的 right 和 top 的值暂时没有其他方法

## position display float

- 如果`display`为`null`，则`position`和`float`不会起任何作用
- 如果`position`为`flex`或者`absolute`时，`float`不会起作用,`display`一般为对应值对应的状态,但是`inline`时,效果为`block`,详细为下表
- 如果不符合上边的情况,且`float`不为`none`,则`display`的效果为下表

|                                                                          值                                                                          |     效果值     |
| :--------------------------------------------------------------------------------------------------------------------------------------------------: | :------------: |
|                                                                     inline-table                                                                     |     table      |
| inline,table-row-group, table-column, table-column-group, table-header-group, table-footer-group, table-row, table-cell, table-caption, inline-block |     block      |
|                                                                         其他                                                                         | 对应的特殊效果 |

## 创建一个值为`"a"='b'`的 html 属性

使用转义字符实现,常用转义字符如下：

|        字符        | 十进制  | 转义字符 |
| :----------------: | :-----: | :------: |
|         "          | \&#34;  | \&quot;  |
|         &          | \&#38;  |  \&amp;  |
|         <          | \&#60;  |  \&lt;   |
|         >          | \&#62;  |  \&gt;   |
| non-breaking space | \&#160; | \&nbsp;  |

```html
<button id="move" name="&#34;a&#34;='b'">move</button>
```
