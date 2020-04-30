# 第三周总结

## 表达式

### Left-Hand-Side Expressions

- MemberExpression
  - PrimaryExpression
    - 第二周总结
  - MemberExpression
    - \[Expression\]
    - .IdentifierName
    - TemplateLiteral
    - SuperProperty(super.b,super\[a\])
    - MetaProperty
      - new.target
  - new MemberExpression
    - MemberExpression
    - new NewExpression
  - CallExpression
    - foo()
    - SuperCall`(super())`
    - \[Expression\] `(foo()['a'])`
    - .IdentifierName`(foo().b)`
    - TemplateLiteral (foo()\`abc\`)

### Right-Hand-Side Expressions

#### UpdateExpression

```
UpdateExpression[Yield, Await] :
  LeftHandSideExpression[?Yield, ?Await]
  LeftHandSideExpression[?Yield, ?Await] [no LineTerminator here] ++
  LeftHandSideExpression[?Yield, ?Await] [no LineTerminator here] --
  ++ UnaryExpression[?Yield, ?Await]
  -- UnaryExpression[?Yield, ?Await]
```

- Update
  - a++
  - a--
  - --a
  - ++a

```js
var a=b=c=1;
a
++
b
++
c
//a:1,b:2,c:2
// ++/--前如果有<LF>，会影响自动插入分号
```

#### UnaryExpression

```
UnaryExpression[Yield, Await] :
  UpdateExpression[?Yield, ?Await]
  delete UnaryExpression[?Yield, ?Await]
  void UnaryExpression[?Yield, ?Await]
  typeof UnaryExpression[?Yield, ?Await]
  + UnaryExpression[?Yield, ?Await]
  - UnaryExpression[?Yield, ?Await]
  ~ UnaryExpression[?Yield, ?Await]
  ! UnaryExpression[?Yield, ?Await]
  [+Await] AwaitExpression[?Yield]
```

| typeof val |   result    |
| :--------: | :---------: |
| Undefined  | "undefined" |
|    Null    |  "object"   |
|  Boolean   |  "boolean"  |
|   Number   |  "number"   |
|   String   |  "string"   |
|   Symbol   |  "symbol"   |
|   Object   |  "object"   |
|  Function  | "function"  |

#### Exponentiation Operator

右结合 `2**3**2`

```
ExponentiationExpression[Yield, Await] :
  UnaryExpression[?Yield, ?Await]
  UpdateExpression[?Yield, ?Await] ** ExponentiationExpression[?Yield, ?Await]
```

#### 其他

- Multiplicative Operators
- Additive Operators
- Bitwise Shift Operators
- Relational Operators
- Equality Operators
- Binary Bitwise Operators
- Binary Logical Operators
- Conditional Operator ( ? : )
- Assignment Operators
  - *= /= %= += -= <<= >>= >>>= &= ^= |= **=
- Comma Operator ( , )

## 类型转换

|           |     Number     |      String      | Boolean  | undefiner | Null  | Object | Symbol |
| :-------- | :------------: | :--------------: | :------: | :-------: | :---: | :----: | :----: |
| Number    |       -        |                  | 0 false  |           |       | Boxing |   x    |
| String    |                |        -         | "" false |           |       | Boxing |   x    |
| Boolean   | true 1 false 0 |  'true' 'false'  |    -     |           |       | Boxing |   x    |
| undefiner |      NaN       |   'undefiner'    |  false   |     -     |       |        |   x    |
| Null      |       0        |      'null'      |  false   |           |   -   |        |   x    |
| Object    |    valueof     | valueof toString |   true   |           |       |   -    |   x    |
| Symbol    |       x        |        x         |    x     |     x     |   x   | Boxing |   -    |

## 语句

### Statement

- 简单语句
  - ExpressionStatement
  - EmptyStatement
  - DebuggerStatement
  - ThrowStatement
  - ContinuxStatement
  - BreakStatement
  - ReturnStatement
- 复合语句
  - BlockStatement
  - IfStatement
  - SwitchStatement
  - IterationStatement
    - while
    - do while
    - for for本身会产生一个作用域`()`，不会影响for后面的`{}`块级作用域
    - for in
    - for of
    - for awiat of
  - WithStatement
  - LabelledStatement
  - TryStatement
- 声明
  - FunctionDeclaration
  - GenerationDeclaration
  - AsyncFunctionDeclaration
  - AsyncGenerationDeclaration
  - VariableStatement
  - ClassDeclaration
  - LexicalDeclaration

### Runtime

#### Completion Record

- \[\[type]]: normal,break,continue,return,throw
- \[\[value]]: Types(8种类型)
- \[\[target]]: label

>\[\[type]]: normal, \[\[value]]: --, \[\[target]]: --
>
> - BlockStatement
>
>\[\[type]]: break continue, \[\[value]]: --, \[\[target]]: label
>
>- LabelledStatement
>- IterationStatement
>- ContinuxStatement
>- SwitchStatement
>- BreakStatement
>
>\[\[type]]: return, \[\[value]]: --, \[\[target]]: label
>
> - TryStatement
>

#### Lexical Environment

## 对象

### Built-in Exotic Object Internal Methods and Slots

- Bound Function Exotic Objects
  - \[\[BoundTargetFunction]]
  - \[\[BoundThis]]
  - \[\[BoundArguments]]
- Array Exotic Objects
  - **length** is always a nonnegative integer less than 232
- String Exotic Objects
  - **length**  is the number of code unit elements in the encapsulated String value.
- Arguments Exotic Objects
- Integer-Indexed Exotic Objects
- Module Namespace Exotic Objects
  - [[Module]]
  - [[Exports]]
  - [[Prototype]]
- Immutable Prototype Exotic Objects

### Proxy Object Internal Methods and Internal Slots

| Internal Method       | Handler Method           |
| :-------------------- | :----------------------- |
| [[GetPrototypeOf]]    | getPrototypeOf           |
| [[SetPrototypeOf]]    | setPrototypeOf           |
| [[IsExtensible]]      | isExtensible             |
| [[PreventExtensions]] | preventExtensions        |
| [[GetOwnProperty]]    | getOwnPropertyDescriptor |
| [[DefineOwnProperty]] | defineProperty           |
| [[HasProperty]]       | has                      |
| [[Get]]               | get                      |
| [[Set]]               | set                      |
| [[Delete]]            | deleteProperty           |
| [[OwnPropertyKeys]]   | ownKeys                  |
| [[Call]]              | apply                    |
| [[Construct]]         | construct                |
