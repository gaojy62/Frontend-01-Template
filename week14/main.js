function createElement(Cls, attribute, ...children) {
  let o = new Cls()
  for (let name in attribute) {
    o.setAttribute(name, attribute[name])
  }
  for (let child of children) {
    o.appenChild(child)
  }
  return o
}

class Div {
  constructor(config) {
    this.children = []
    this.root = document.createElement('div')
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appenChild(child) {
    this.children.push(child)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}

let component = (
  <Div id="a" class="b" style="width:100px;height:100px;background:red">
    <Div></Div>
    <Div></Div>
    <Div></Div>
  </Div>
)
component.mountTo(document.body)

console.log(component)
