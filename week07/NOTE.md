# toy browser

## parse HTTP

- parse start line
- parse HTTP Header
- parse HTTP body

## parse HTML

- startTag
  - startOpen
  - tagName
  - attributeName
  - attributeValue
  - tagClose
- textNode
- endTag
  - startOpen
  - tagName
  - tagClose
- selfCloseTag
  - startOpen
  - tagName
  - attributeName
  - attributeValue
  - slash
  - tagClose

## parseCss

- getAST
- computeCss
  - 获取当前元素的所有父元素，优先匹配当前元素
- matchSelector
  - 拆分选择器
  - 从最后一个选择器向前匹配
- compute specificity
  - `!important` > `inline` > `id > class | 伪类 | attribute` > `tagName | 伪元素` > `* | 关系选择器 | 否定类选择器  (不影响优先级)`
- compare
  - 生成 computedCSS

## layout

根据 flex 布局的特性计算 parseCSS 中生成的 computedCSS 生成最终呈现的样式
