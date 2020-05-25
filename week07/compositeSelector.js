let currentClass = ''
let currentId = ''
let tagName = ''
let tagId = []
let tagClass = []

function compositeSelector(string) {
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

module.exports = {
  compositeSelector,
}
