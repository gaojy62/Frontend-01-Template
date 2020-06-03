// > 直接子节点，  ' ' 子孙组合器， ~ 一般兄弟组合器， + 紧邻组合器
// : 伪类 ， ::伪元素
// id class attribute name
// *

let currentClass = ''
let currentId = ''
let tagName = ''
let tagId = []
let tagClass = []

function compositeSelectors(string) {
  tagId = []
  tagClass = []
  tagName = ''
  let state = start
  for (let c of string) {
    state = state(c)
  }
  state('\u0000')
  return {
    tagName,
    tagId,
    tagClass,
  }
}

function start(c) {
  if (c === '\u0000') {
    return
  } else if (c.match(/[a-zA-Z]/)) {
    return setTagName(c)
  } else if (c === '.') {
    return setClass
  } else if (c === '#') {
    return setId
  }
}

function setTagName(c) {
  if (c === '\u0000') {
    return
  } else if (c === '.') {
    return setClass
  } else if (c === '#') {
    return setId
  } else {
    tagName += c
    return setTagName
  }
}

function setClass(c) {
  if (c === '\u0000') {
    tagClass.push(currentClass)
    currentClass = ''
  } else if (c === '.') {
    tagClass.push(currentClass)
    currentClass = ''
    return setClass
  } else if (c === '#') {
    tagClass.push(currentClass)
    currentClass = ''
    return setId
  } else {
    currentClass += c
    return setClass
  }
}

function setId(c) {
  if (c === '\u0000') {
    tagId.push(currentId)
    currentId = ''
  } else if (c === '.') {
    tagId.push(currentId)
    currentId = ''
    return setClass
  } else if (c === '#') {
    tagId.push(currentId)
    currentId = ''
    return setId
  } else {
    currentId += c
    return setId
  }
}

// 只是实现了复合选择器（不包括属性），没有实现复杂选择器
function match(element, selector) {
  let matchId = (matchClass = matchTagName = false)
  if (!selector || !element.attributes) return false

  let compositeSelector = compositeSelectors(selector)

  if (compositeSelector.tagId.length > 0) {
    let attr = element.attributes.filter((attr) => attr.name === 'id')
    if (attr.length > 0) {
      if (isContain(attr[0].value.split(' '), compositeSelector.tagId)) {
        matchId = true
      }
    }
  } else {
    matchId = true
  }

  if (compositeSelector.tagClass.length > 0) {
    let attr = element.attributes.filter((attr) => attr.name === 'class')
    if (attr.length > 0) {
      if (isContain(attr[0].value.split(' '), compositeSelector.tagClass)) {
        matchClass = true
      }
    }
  } else {
    matchId = true
  }

  if (compositeSelector.tagName.length > 0) {
    if (element.tagName === compositeSelector.tagName) {
      matchTagName = true
    }
  } else {
    matchTagName = true
  }

  if (matchId && matchClass && matchTagName) return true

  return false
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
