# 浏览器工作原来之 CSS 解析

## 收集 CSS rules

css 规则收集要在创建dom树之前，遇到`style`标签要把css规则保存起来;遇到`link`标签,判断`rel`属性正确后请求网络资源下载 css 文件,然后保存 css 规则。然后解析收集的 css rules,生成 ast

> 生成 ast 使用的是[社区开源库](https://www.npmjs.com/package/css)

在上一节课状态机解析 html 代码的基础上添加 `addCSSRules` 函数,当 style 元素出栈前调用 `addCSSRules` 函数去收集 css rules

```js
...
else if (token.type === 'endTag') {
  if (top.tagName !== token.tagName) {
    throw new Error('tag name do not match')
  } else {
    if (top.tagName === 'style') {
      parseCss.addCSSRules(top.children[0].content)
    }
    // 非自封闭标签匹配完成后出栈
    stack.pop()
  }
  // top.children.push(currentTextNode)
  currentTextNode = null
}
...


function addCSSRules(cssText) {
  const ast = css.parse(cssText)
  rules.push(...ast.stylesheet.rules)
  console.log(rules)
}
```

## 获取父元素序列

每创建一个 dom 时,就需要计算当前 dom 对应的 css,理论上,当分析一个 dom 时,所有的 css rules 已经收集完毕.如果把 css rules 写在 body 标签中,则需要重新计算之前dom的 css

> css代码不要写在body中,这样会造成重新计算 css
>
> 性能消耗(越小越好): 重新计算 css > 重排 > 重绘

计算 css rule 的代码如下:

在每次给元素添加完 `attributes` 后,都需要立马去计算当前 dom 对应的 css rule,生成 `computedStyle` 对象,对象里保存着当前 dom 的最终 css rule

```js
for (let p in token) {
  if (p !== 'type' && p !== 'tagName') {
    element.attributes.push({
      name: p,
      value: token[p],
    })
  }
}

parseCss.computeCss(element, stack)
```

`computeCss` 函数:

```js
function computeCss(element, stack) {
  // elements 里存放着当前 element 的所有父元素
  const elements = stack.slice().reverse()

  if (!element.computedStyle) element.computedStyle = {}

  let matched = false

  // 每一个 element 都要遍历一遍 css rules
  for (let rule of rules) {
    // 反转选择器 div div #myid --> #myid div div
    let selectorParts = rule.selectors[0].split(' ').reverse()

    // 第一项没匹配上，则跳出当前循环
    // div div #myid，如果 #myid 没有匹配到，则不需要再比较后续的 div
    if (!match(element, selectorParts[0])) continue

    // 默认从第二项开始匹配,elements 中不包含 element 所以 i 从0开始
    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if ((match(elements[i]), selectorParts[j])) {
        j++
      }
    }

    // 当遍历完 elements 时，j >= selectorParts.length 说明匹配成功
    if (j >= selectorParts.length) matched = true

    // css rule 与 element 匹配成功时，将对应的 css rule 添加到 element 的 computedStyle 属性上
    if (matched) {
      let sp = specificity(rule.selectors[0])
      let computedStyle = element.computedStyle
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        // 第一次匹配时，直接将样式的值和优先级添加到 对应 css 属性中，这里是把 css 属性看作为一个对象，里面包含了 value 和 specificity
        // 每个 css 属性都包含一个 value 和 specificity
        // width:{
        //   value: '100px',
        //   specificity : []
        // }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) <= 0
        ) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
    }
  }
}
```

元素匹配 css rules 一定是由内向外.一定是先找到当前元素,然后再找父元素,所以我们必须知道当前元素的所有父元素才能判断元素与规则是否匹配

> 匹配 `div div #myid` , 一定是先找到 id 为 myid 的元素,然后再去判断他是否有父 div 元素,最后判断是否有爷 div 元素,如果中间一个环节出错,则当前规则不匹配

## 拆分选择器并计算选择器与元素匹配

这里仅仅实现了子孙选择器,复杂选择器在这里没有体现

```js
// 每一个 element 都要遍历一遍 css rules
for (let rule of rules) {
  // 反转选择器 div div #myid --> #myid div div
  let selectorParts = rule.selectors[0].split(' ').reverse()

  // 第一项没匹配上，则跳出当前循环
  // div div #myid，如果 #myid 没有匹配到，则不需要再比较后续的 div
  if (!match(element, selectorParts[0])) continue

  // 默认从第二项开始匹配,elements 中不包含 element 所以 i 从0开始
  let j = 1
  for (let i = 0; i < elements.length; i++) {
    if ((match(elements[i]), selectorParts[j])) {
      j++
    }
  }

  // 当遍历完 elements 时，j >= selectorParts.length 说明匹配成功
  if (j >= selectorParts.length) {
    matched = true
  }
...
```

每个 css rule 中 selectors 是一个数组,包含了当前 rule 的所有选择器,顺序为从父到子

```js
// 反转选择器 div div #myid --> #myid div div
let selectorParts = rule.selectors[0].split(' ').reverse()
```

>selectorParts = ['body','div','myid']

拆分完选择器后需要计算选择器与元素的匹配关系,优先计算当前元素与选择器 `selectorParts` 的第一项是否匹配,如果不匹配直接放弃后续计算,开始下一个 rule;如果与第一项匹配成功则与 `selectorParts` 进行计算,这里采用一个循环完成, `i` 代表父元素的`length`, `j` 代表选择器的 `length`

```js
// 默认从第二项开始匹配,elements 中不包含 element 所以 i 从0开始
let j = 1
for (let i = 0; i < elements.length; i++) {
  if ((match(elements[i]), selectorParts[j])) {
    j++
  }
}

// 当遍历完 elements 时，如果 j >= selectorParts.length 说明匹配成功
if (j >= selectorParts.length) {
  matched = true
}
```

## 生成 computed 属性

```js
if (matched) {
  // 生成 css rule 的优先级
  let sp = specificity(rule.selectors[0])
  let computedStyle = element.computedStyle
  for (let declaration of rule.declarations) {
    if (!computedStyle[declaration.property]) {
      computedStyle[declaration.property] = {}
    }
    // 第一次匹配时，直接将样式的值和优先级添加到 对应 css 属性中，这里是把 css 属性看作为一个对象，里面包含了 value 和 specificity
    // 每个 css 属性都包含一个 value 和 specificity
    // width:{
    //   value: '100px',
    //   specificity : []
    // }
    if (!computedStyle[declaration.property].specificity) {
      computedStyle[declaration.property].value = declaration.value
      computedStyle[declaration.property].specificity = sp
    } else if (
      compare(computedStyle[declaration.property].specificity, sp) <= 0
    ) {
      computedStyle[declaration.property].value = declaration.value
      computedStyle[declaration.property].specificity = sp
    }
  }
}
```

匹配成功后,需要生成 `computedStyle`,这里比较简单,大体思路如下:

- 如果当前属性在 `computedStyle` 不存在,则创建
- 如果已经存在,则比较优先级,优先级高的保留

生成 css rule 特指度(优先级)的规则:

特指度构成: [0,0,0,0],特指度由左向右比较,[1,0,0,0]的优先级高于所有第一位是0的特指度

- id选择器优先级最高  [0,1,0,0]
- class选择器,属性选择器,伪类选择器  [0,0,1,0]
- 元素和伪元素  [0,0,0,1]
- 行内样式  [1,0,0,0]

```js
function specificity(selector) {
  let p = [0, 0, 0, 0]
  let selectorParts = selector.split(' ')
  for (let part of selectorParts) {
    // compositeSelector 结构如下:
    // compositeSelector = {
    //   tagName, 字符串
    //   tagId, 数组
    //   tagClass, 数组
    // }
    let compositeSelector = parseSelector.compositeSelector(part)
    if (compositeSelector.tagId.length > 0) {
      p[1] += compositeSelector.tagId.length
    }
    if (compositeSelector.tagClass.length > 0) {
      p[2] += compositeSelector.tagClass.length
    }
    if (compositeSelector.tagName.length > 0) {
      p[3] += 1
    }
  }
  return p
}
```

`compositeSelector` 函数使用状态机拆分复合选择器`(div.class#id)`

## 确定规则覆盖关系

上一步已经计算出每个 rule 的特指度,现在只要比较特指度的优先级,然后遵循优先级高的覆盖优先级低的,同等优先级后者覆盖前者的规则去写代码即可

```js
if (!computedStyle[declaration.property].specificity) {
  computedStyle[declaration.property].value = declaration.value
  computedStyle[declaration.property].specificity = sp
} else if (
  compare(computedStyle[declaration.property].specificity, sp) <= 0
) {
  computedStyle[declaration.property].value = declaration.value
  computedStyle[declaration.property].specificity = sp
}
```

如果当前 rule 是第一次匹配到当前 `element` ,直接将计算好的 `sp` 添加到 `computedStyle` 中即可;如果后续再匹配成功,则需要与之前的 `sp` 进行比较

```js
function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0]
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1]
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2]
  return sp1[3] - sp2[3]
}
```

## 结束

至此,我们已经完成了一个 css rules 的收集到最终生成 computedStyle 的全过程

完整代码在 week05 目录下,完成了复合选择器的匹配和优先级计算及比较
