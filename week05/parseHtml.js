const EOF = Symbol('EOF')

let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{ type: 'document', children: [] }]

function emit(token) {
  let top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: [],
      tagName: token.tagName,
    }

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        })
      }
    }

    top.children.push(element)
    element.parent = top

    // 自封闭标签不需要入栈
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('tag name do not match')
    } else {
      // 非自封闭标签匹配完成后出栈
      stack.pop()
    }
    // top.children.push(currentTextNode)
    currentTextNode = null
  } else if (token.type === 'text') {
    // 处理文本节点，文本节点直接追加到父节点的子元素上
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      }
      // 注意这里push的是对象，由于对象的引用修改一处会影响其他
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    })
    return
  } else {
    emit({
      type: 'text',
      content: c,
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
  } else if (c === EOF) {
    throw new Error('eof-before-tag-name parse-error')
  } else {
    console.log('invalid-first-character-of-tag-name parse error.')
    return data(c)
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c.toLowerCase()
    return tagName
  } else if (c === EOF || c === '\u0000') {
    throw new Error('parse-error')
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
    console.log('unexpected-equals-sign-before-attribute-name parse error')
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName
  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(/^[\n\f\t ]$/) || c === '/' || c === EOF || c === '>') {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentAttribute.name += c
    return attributeName
  } else if (c === '\u0000') {
    throw new Error('unexpected-null-character parse error.')
  } else if (c === '"' || c === "'" || c === '<') {
    throw new Error('unexpected-character-in-attribute-name parse error.')
  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error.')
  } else {
    // 有歧义
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
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
    throw new Error(' missing-attribute-value parse error.')
  } else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    // 有歧义
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
    throw new Error('unexpected-null-character parse error.')
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error.')
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
    throw new Error('unexpected-null-character parse error.')
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error.')
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
    // 有歧义
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentAttribute)
    return data
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error.')
  } else {
    console.log('missing-whitespace-between-attributes parse error.')
    return beforeAttributeName(c)
  }
}

function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 有歧义
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === '\u0000') {
    throw new Error('unexpected-null-character parse error. ')
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error.')
  } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`') {
    throw new Error(
      ' unexpected-character-in-unquoted-attribute-value parse error.'
    )
  } else {
    currentAttribute.value += c
    return unquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === EOF) {
    throw new Error('eof-in-tag parse error.')
  } else {
    console.log('unexpected-solidus-in-tag parse error')
    return beforeAttributeName(c)
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
    throw new Error('missing-end-tag-name parse error.')
  } else if (c === EOF) {
    throw new Error('eof-before-tag-name parse error.')
  } else {
    throw new Error(' invalid-first-character-of-tag-name parse error.')
  }
}

module.exports.parseHtml = function parseHtml(html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
}
