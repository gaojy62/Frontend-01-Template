# CSS

## css选择器分类

- 简单选择器
  - id
  - class
  - tagName
  - attribute
    - [att] 只要元素有这个属性，就可以被选中
    - [att=val] 精确匹配，检查一个 att 属性的值是否是 val
    - [attr~=value] 表示带有以 attr 命名的属性的元素，并且该属性是一个以空格作为分隔的值列表，其中至少有一个值为 value
    - [attr|=value] 表示带有以 attr 命名的属性的元素，属性值为“value”或是以“value-”为前缀（"-"为连字符，Unicode 编码为 U+002D）开头。典型的应用场景是用来匹配语言简写代码（如 zh-CN，zh-TW 可以用 zh 作为 value）
    - [attr^=value] 带有以 attr 命名的属性，且属性值是以 value 开头的元素
    - [attr$=value] 表示带有以 attr 命名的属性，且属性值是以 value 结尾的元素
    - [attr*=value] 表示带有以 attr 命名的属性，且属性值包含有 value 的元素
  - 伪元素选择器
    - ::before
    - ::after
    - first-line
      - font 系列
      - color 系列
      - background 系列
      - word-spacing
      - letter-spacing
      - text-decoration
      - text-transform
      - line-height
    - first-letter
      - font 系列
      - color 系列
      - background 系列
      - word-spacing
      - letter-spacing
      - text-decoration
      - text-transform
      - line-height
      - float
      - vertical-align
      - 盒模型系列：margin、padding、border 
- 复合选择器
- 复杂选择器
  - \>
  - ~
  - \+
  - 空格

## 优先级

`!important` > `inline` > `id > class | 伪类 | attribute` > `tagName | 伪元素` > `* | 关系选择器 | 否定类选择器  (这三个不影响优先级)`

## BFC

如果一个元素具有 BFC，那么它不会影响外部的元素。所以，BFC 元素是不可能发生 margin 重叠的，因为 margin 重叠是会影响外部的元素的。同时 BFC 可以用来清楚浮动带来的高度塌陷问题

- block-level 表示可以被放入 bfc
- block-container 表示可以容纳 bfc
- block-box = block-level + block-container
- block-box 如果 overflow 是 visible， 那么就跟父 bfc 合并
