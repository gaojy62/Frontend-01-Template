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
  }
}

function match(element, selector) {
  if (!selector || !element.attributes) return false

  if (selector.charAt[0] === '#') {
    let attr = element.attributes.filter((attr) => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt[0] === '.') {
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
