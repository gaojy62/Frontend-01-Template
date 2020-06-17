# 第十周总结

## Range

range api 可以操作 text 节点，可以在文本节点之间插入/删除节点

习题：反转 dom 节点

初始内容：

```html
<div id="container">
  <span>1</span>
  <div>2</div>
  <p>3</p>
  <h5>4</h5>
</div>
```

反转后：

```html
<div id="container">
  <h5>4</h5>
  <p>3</p>
  <div>2</div>
  <span>1</span>
</div>
```

一般答案：利用 childNodes 的 live collections 特性和 append dom 节点默认会删除之前的节点特性来实现，但是每次 append 都会触发重排。

满分答案：使用 Range API 操作 dom ，整个过程只触发两次重排

```js
const element = document.getElementById('container')
function reverseDom (element) {
    let range = new Range()
    range.selectNodeContents(element)
    let fragment = range.extractContents();
    let len = fragment.childNodes.length
    while(len-- > 0) {
        fragment.appendChild(fragment.childNodes[len])
    }
    element.appendChild(fragment)
}

reverseDom(element)
```

## CSSOM API

### document.styleSheets

`document.styleSheets`
只能得到 \<style\> 标签和外联方式插入的样式，并且得到的 styleSheet 中只包含该标签内定义的属性内容，不能获取到元素的行内样式
方法:

- `document.styleSheets[0].cssRules` 得到 CSS 规则，是一个 CSSRuleList
- `document.styleSheets[0].insertRule("p { color: pink; }", index)` 往 index 的位置插入CSS规则 p { color: pink; }
- `document.styleSheets[0].removeRule(index)` 删除第 index 条规则
- `document.styleSheets[0].cssRules[0].selectorText = "span"`
- `document.styleSheets[0].cssRules[1].style.color = "yellow"`

### getComutedStyle

`getComputedStyle(element, pseudoElement /* 可选,伪元素 */)`得到某元素计算后的样式,从 getComputedStyle 返回的对象是只读的，可以用于检查元素的样式

### CSSOM View

- window.open(url, windowName, [windowFeatures]) 开一个新窗口

- window.close() 关闭当前窗口

- window.scroll(x, y) 窗口滚动 （ x, y 是绝对位置的值 ）

- window.scrollBy(x, y) 窗口滚动 （ x, y 是相对当前位置的差值 ）

- window.innerWidth 视口的宽度

- window.innerHeight 视口的高度

- window.devicePixelRatio 物理像素（分辨率）与 逻辑像素（屏幕宽度）的比值--DPR

- ele.scrollHeight 元素滚动窗口中的完整内容所占的高度

- ele.getClientRects() 获得元素在视口的位置和所占的空间( inline 元素会由于排版产生多个行盒的原因，会得到多个 Rect )

- ele.getBoundingClientRect() 获得包裹此元素的盒 的位置和所占的空间（?? 不会受到外面包裹容器的 scroll 影响，会根据实际渲染所占的区域，不会超出可见区域）

- document.documentElement.getBoundingClientRect() 视口的位置和所占的空间大小
