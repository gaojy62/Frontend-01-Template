const parser = require('./parser')

module.exports = function (source, map) {
  let tree = parser.parseHTML(source)
  
  let template = null
  let script = null
  for(let node of tree.children) {
    if(node.tagName === 'template'){
      template = node.children.filter(node => node.type != 'text')[0]
    }
    if(node.tagName === 'script'){
      script = node
    }
  }
  console.log(template.children[1])
  let visit = (node) => {
    if(node.type == 'text'){
      return JSON.stringify(node.content)
    }
    let attrs = {}
    for(let attribute of node.attributes) {
      if(attribute.name != 'type' && attribute.name != 'isSelfClosing' && attribute.name != 'tagName'){
        attrs[attribute.name] = attribute.value
      }
    }
    let children = node.children.map(node => visit(node))
    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  }

  return`
import { createElement, Text, Wrapper } from './createElement'
export class Carousel {
  render() {
    return ${visit(template)}
  }
  mountTo(parent) {
    this.render().mountTo(parent)
  }
  setAttribute(name, value) {
    this[name] = value
  }
}
  `
}
