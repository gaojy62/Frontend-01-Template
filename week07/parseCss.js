const css = require('css')
const parseSelector = require('./compositeSelector')

const rules = []

function addCSSRules(cssText) {
  const ast = css.parse(cssText)
  rules.push(...ast.stylesheet.rules)
}

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

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) return sp1[0] - sp2[0]
  if (sp1[1] - sp2[1]) return sp1[1] - sp2[1]
  if (sp1[2] - sp2[2]) return sp1[2] - sp2[2]
  return sp1[3] - sp2[3]
}

function specificity(selector) {
  let p = [0, 0, 0, 0]
  let selectorParts = selector.split(' ')
  for (let part of selectorParts) {
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

function isContain(arr1, arr2) {
  for (let item of arr2) {
    // 每开始找一个值就把标志位置为 false，如果后续找到就置为 true，
    // 当内层循环完成后值还为 false 则返回 false 表示没有匹配成功
    // 如果外层循环完没有返回 false 则表示匹配成功，返回 true
    let itemInArr1 = false
    for (let itemOfArr1 of arr1) {
      // 如果有对应值则跳出循环，继续寻找 arr2 中的下一个值
      if (itemOfArr1 === item) {
        itemInArr1 = true
        continue
      }
    }
    // 如果当前值 item 在 arr1 中没有对应值，则说明不匹配
    if (!itemInArr1) {
      return false
    }
  }
  return true
}

function match(element, selector) {
  if (!selector || !element.attributes) return false

  let compositeSelector = parseSelector.compositeSelector(selector)

  if (compositeSelector.tagId.length > 0) {
    let attr = element.attributes.filter((attr) => attr.name === 'id')
    if (attr.length > 0) {
      if (isContain(attr[0].value.split(' '), compositeSelector.tagId)) {
        return true
      }
    }
  } else if (compositeSelector.tagClass.length > 0) {
    let attr = element.attributes.filter((attr) => attr.name === 'class')
    if (attr.length > 0) {
      if (isContain(attr[0].value.split(' '), compositeSelector.tagClass)) {
        return true
      }
    }
  } else {
    if (element.tagName === compositeSelector.tagName) {
      return true
    }
  }
  return false

}

module.exports = {
  addCSSRules,
  computeCss,
}
