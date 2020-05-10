# JS 结构化总结

## Realm

JS 执行粒度(从大到小排序)

- JS Context -> Realm
- 宏任务
- 微任务
- 函数调用
- 语句/声明
- 表达式
- 直接量/变量/this

每个 realm 里有一套完整的 JS 内置对象,获取内置对象代码数量及路径如下:

> 不同环境数量可能一致,在一个空包页面里有 448 个

```js
const set = new Set()
const globalProperties = [
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Array',
  'Date',
  'RegExp',
  'Promise',
  'Proxy',
  'Map',
  'WeakMap',
  'Set',
  'WeakSet',
  'Function',
  'Boolean',
  'String',
  'Number',
  'Symbol',
  'Object',
  'Error',
  'EvalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Uint8Array',
  'Uint16Array',
  'Uint32Array',
  'Uint8ClampedArray',
  'Atomics',
  'JSON',
  'Math',
  'Reflect',
  'BigInt',
]

const queue = []
for (let item of globalProperties) {
  queue.push({
    path: [item],
    object: this[item],
  })
}

let current,
  i = 0
while (queue.length) {
  i++
  current = queue.shift()
  console.log(i + ':' + current.path.join('.'))
  set.add(current.object)
  for (key of Object.getOwnPropertyNames(current.object)) {
    let property = Object.getOwnPropertyDescriptor(current.object, key)
    if (
      (property.value !== null && typeof property.value === 'object') ||
      typeof property.value === 'function'
    ) {
      if (!set.has(property.value))
        queue.push({
          path: current.path.concat([key]),
          object: property.value,
        })
    }
    if (property.get) {
      if (!set.has(property.get))
        queue.push({
          path: current.path.concat([key]),
          object: property.get,
        })
    }
    if (property.set) {
      if (!set.has(property.set))
        queue.push({
          path: current.path.concat([key]),
          object: property.set,
        })
    }
  }
}
```

### Execution Context Stack

一个 Execution Context Stack 里包含着多个 Execution Context,调用一个函数向 Execution Context Stack 中`push`一个 Execution Context ,返回一个函数 Execution Context Stack`pop`一个Execution Context

每个 Execution Context 中包含着多个内容

Execution Context:

- code evaluation state
- Function
- Script or Module
- Generator
- Realm
- LexicalEnvironment
  - this
  - new.target
  - super
  - 变量
- VariableEncironment

code evaluation state,记录代码执行位置,主要用在 `async`,`generator` 函数中

Execution Context 中执行的是一个函数的话则会记录Function,如果是在一个全局的`script`中执行,则 Function 为`null`

Script or Module 同 Function

只有执行 Generator 函数才会产 Generator

LexicalEnvironment 词法环境,平时接触最多的。其中的 this 比较特殊，当为箭头函数时，在函数创建时 this 和变量一起确定，当为普通函数时，this 在调用时动态的去创建

VariableEnvironment 是一个历史遗留问题，主要用于处理`var`声明

LexicalEnvironment 和 VariableEnvironment 由复杂的 Environment Records 链表组成。

- Environment Records
  - Global Environment Records
  - Object Environment Records
  - Declarative Environment Records
    - Function Environment Records
    - Module Environment Records

Global Environment Records 就是全局环境，位于 Environment Records 的最顶端，每个 Realm 里也就只有一个

Object Environment Records 一般由`with`产生

Function Environment Records 由函数产生

Module Environment Records `import`,`export`产生

Realm

在 JS 中,函数表达式和对象直接量均会创建对象

使用`.`做隐式转换也会创建对象

这些被创建的对象也是由原型的,如果没有Realm,我们就无法知道它们是什么

举例栗子:
打开一个空白页,在 body 下添加一个`iframe`

```js
var ifr = document.createElement('iframe')
document.body.appendChild(ifr)
// 在 iframe 的 window 上添加一个对象 o
ifr.contentWindow.eval('this.o = {}')
//判断 原始页面 Realm 中的 Object 是否为 iframe Realm 中对象 o 的构造函数,结果返回false
ifr.contentWindow.o instanceof Object //false
//当 Realm 一致时为 true
ifr.contentWindow.o instanceof ifr.contentWindow.Object // true

ifr.contentWindow.Object === Object //false

Object === Object // true
```
