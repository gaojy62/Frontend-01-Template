const css = require('css')

const rules = []

function addCSSRules(cssText) {
  const ast = css.parse(cssText)
  console.log(css.stringify(ast))
  rules.push(...ast.stylesheet.rules)
}

function computeCss(element, stack) {
  const elements = stack.slice().reverse()
}

module.exports = {
  addCSSRules,
  computeCss,
}
