const css = require('css')

const rules = []

function addCSSRules(cssText) {
  const ast = css.parse(cssText)
  rules.push(...ast.stylesheet.rules)
  console.log(rules)
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
          compare(computedStyle[declaration.property].specificity, sp) < 0
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
    if (part.charAt(0) === '#') {
      p[1] += 1
    } else if (part.charAt(0) === '.') {
      p[2] += 1
    } else {
      p[3] += 1
    }
  }
  return p
}

function match(element, selector) {
  if (!selector || !element.attributes) return false

  if (selector.charAt(0) === '#') {
    let attr = element.attributes.filter((attr) => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter((attr) => attr.name === 'class')[0]
    if (attr && attr.value === selector.replace('.', '')) {
      return true
    }
  } else {
    if (element.tagName === selector) {
      return true
    }
  }
  return false
}

module.exports = {
  addCSSRules,
  computeCss,
}
