const EOF = Symbol('EOF')
let currentToken = null
let currentAttribute = null

function emit(token) {
  console.log(token)
}

function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF',
      tagName: null,
    })
    return
  } else {
    emit({
      type: 'text',
      tagName: c,
    })
    return data
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    }
    return tagName(c)
  } else {
    return tagOpen
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c.toLowerCase()
    return tagName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    currentToken.tagName += c
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    // 抛错
  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
  }
}

function afterAttributeName(c) {
  if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
  } else {
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(/^[\n\f\t ]$/) || c === '/' || c === EOF || c === '>') {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeValue
  } else if (c === "'") {
    return singleQuotedAttributeValue
  } else if (c === '"') {
    return doubleQuotedAttributeValue
  } else if (c === '>') {
    //抛错
  } else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentAttribute)
    return data
  }
}

function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '=') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else if (c === '"' || c === "'" || c === '<' || c === '=') {
  } else {
    currentAttribute.value += c
    return unquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken.isSelfClosing = true
    return data
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    }
    return tagName(c)
  } else if (c === '>') {
  } else if (c === EOF) {
  } else {
  }
}

module.exports.parseHtml = function parseHtml(html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
}
