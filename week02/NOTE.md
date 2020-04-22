# 第二周总结

## 编程语言通识

### 语言按语法分类

- 非形式语言
  - 中文，英文
- 形式语言（齐姆斯基谱系）
  - 0型 无限制文法 `?::=?` 等号左边可以有多个生成项
  - 1型 上下文相关文法 `?<A>?::=?"x"?`
  - 2型 上下文无关文法 `<A>::=?` 等号左边只能有一个生成项，js大多数情况为2型
  - 3型 正则文法 `<A>::=<A>?` 只允许左递归

现代主流编程语言会把文法分为词法和语法两部分。词法指用正则做一遍粗略的处理，把语言变为单个的词，把这些词作为输入流去做语法分析。

### 产生式(BNF)

- 用尖括号括起来的名称来表示语法结构
- 语法结构非为基础结构和复合结构
  - 基础结构称终结符
  - 复合结构称非终结符
- 引号和中间的字符表示终结符
- 可以有括号
- *表示重复多次
- |表示或
- +表示至少一次

规定一种语言只能以任意个无序的`a`,`b`组成

```VB
<Program> ::= "a"+ | "b"+
<Program> ::= <Program>"a"+ | <Program>"b"+
```

定义一个整数带括号的四则运算

```VB
<Number> ::= "0" | "1" | "2" | .... | "9"

<DecimalNumber> ::= "0" | (("1" | "2" | .... | "9") <Number>* )

//正则写法
<DecimalNumber> ::= /0|[1-9][0-9]*/

<PrimaryExpression> = <DecimalNumber> |
  "("<LogicalExpression>")"

<MultipExpression> ::= <DecimalNumber> |
  <MultipExpression> "*" <PrimaryExpression> |
  <MultipExpression> "/" <PrimaryExpression>

<AddExpression> ::= <MultipExpression> |
  <AddExpression> "+" <MultipExpression> |
  <AddExpression> "-" <MultipExpression> |

<LogicalExpression> ::= <AddExpression> |
  <LogicalExpression> "||" <AddExpression> |
  <LogicalExpression> "&&" <AddExpression>
```

### 图灵完备性

- 命令式--图灵机
  - goto
  - if和while
- 声明式--lambda
  - 递归

### 类型系统

- 动态与静态
- 强类型与弱类型
- 复合类型
  - 结构体
  - 函数签名
- 子类型
  - 逆变/协变

### 一般命令式编程语言

- Atom
  - Identifier
  - Literal
- Expression
  - Atom
  - Operator
  - Punctuator
- Statement
  - Expression
  - Keyword
  - Punctuator
- Strcuture
  - Function
  - Class
  - Process
  - Namespace
  - ...
- Program
  - Program
  - Module
  - Package
  - Library

## JavaScript

### JS 词法、类型

- InputElement
  - Comment
    - // 单行注释
    - /*多行注释*/
  - WhiteSpace
    - \<TAB>
    - \<VT>纵向制表符
    - \<FF> Form Feed
    - \<SP> 日常开发最常用
    - \<NBSP>  处理排版问题
    - \<ZWNBSP>
    - \<USP>
  - LineTerminator
    - \<LF> Line Feed \n 日常开发最常用
    - \<CR> 回车 \r
    - \<LS>
    - \<PS>
  - Token
    - Punctuator (符号)
    - IdentifierName (标识符)
      - Kerwords
      - Identifier
        - 变量名
        - 属性名
      - futureResevedWord
    - Literal (直接量)
      - Number
        - IEEE 754 Double Float
        - 浮点数比较时需要加精度(Math.abs(num1-num2)<=Number.EPSILON)
        - 最佳实践 Number.MAX_SAFE_INTEGEF
        - grammar
          - DecimalIntegerLiteral
          - BinaryIntegerLiteral
          - OctalIntegerLiteral
          - HexIntegerLiteral
      - String
        - Character
        - Code Point
        - Econding
          - UTF
            - UTF-8
            - UTF-16 （内存中实际是以这种方式保存的）
        - grammar
          - " DoubleStringCharactersopt "
          - ' SingleStringCharactersopt '
          - `` 字符串模板
      - Boolen
        - true
        - false
      - Null
      - Undefined

更新脑图
