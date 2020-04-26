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

## 对象
