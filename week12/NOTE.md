# 每周总结可以写在这里

## 字典树

trie树常用于搜索提示。如当输入一个网址，可以自动搜索出可能的选择。当没有完全匹配的搜索结果，可以返回前缀最相似的可能。

## 带括号的四则运算

写对 BNF 即完成了 90%

非常不规范的 BNF

```js
/*
  Expression :
    AdditiveExpression EOF

  AdditiveExpression :
    MultiplicativeExpression
    AdditiveExpression (+ | -) MultiplicativeExpression

  MultiplicativeExpression :
    ExponentiationExpression
    MultiplicativeExpression (* | /)  ExponentiationExpression

  ExponentiationExpression :
    Number
    (Expression)
*/
  ```

## kmp

核心就是求出 next 表，当 pattern 和 source 出现不匹配的情况时，根据 next 表判断回溯到哪个位置

```js
    function getNext(pattern) {
      let result = [0]
      let i = 1
      let j = 0
      while (i < pattern.length) {
        if (pattern[i] === pattern[j]) {
          j++
          result.push(j)
          i++
        } else if (j) {
          j = result[j - 1]
        } else {
          i++
          result.push(0)
        }
        /* 
          下面是老师在课堂上讲的代码，在某些情况下时间复杂度不为 m+n
          而且求出来的 next 表也不正确
        */
        // if (pattern[i] === pattern[j]) {
        //   j++
        // } else {
        //   j = 0
        // }
        // result[i] = j
        // i++
      }
      return result
    }
```

## wildcard

### 没有 *

  依次比对 pattern 和 source ，出现不相等的情况即不匹配

### 有 *

  第一个 * 和最后一个 * 是贪婪匹配，匹配的越多越好，中间的 * 则是匹配的越少越好


  在 kmp 的基础上实现带问号的 kmp ，然后用这个算法去处理2到 n-1 个 * 的情况


  最后一个 * 的要从后向前匹配，如果在遇到 * 之前，或者 source 的剩余的长度不够匹配 pattern 最后一个 * 之后的文本，则说明匹配失败