const parser = require('./parser')

module.exports = function (source, map) {
  let tree = parser.parseHTML(source)
  
  let template = null
  let script = null
  for(let node of tree.children) {
    if(node.tagName === 'template'){
      template = node
    }
    if(node.tagName === 'script'){
      script = node
    }
  }
  console.log(template)
  return ''
}
