# 每周总结可以写在这里

## 异步编程

- setTimeout
  - 回调地狱
- Promise
  - 将回调地狱改为链式表达
- async/await
  - 同步写法写异步函数
  - await 会等待后面的 promise 决议,然后才继续执行 await 后面的代码
  - 捕获异常外面包裹 try catch
- Generator
  - 需要配合 Promise
  - co 框架

sleep 函数

```js
async function sleep(t){
  return new Promise ((resolve,reject) => setTimeOut(()=>resolve(),t))
}
```

## 寻路问题

### BinaryHeap

```js
class MinBinaryHeap {
  constructor(data, compare) {
    this.data = data
    this.compare = compare
  }

  take() {
    if (!this.length) {
      return
    }
    let min = this.data[0]
    let i = 0

    while (i < this.length) {
      if (i * 2 + 1 >= this.length) {
        break
      }
      if (i * 2 + 2 >= this.length) {
        this.data[i] = this.data[i * 2 + 1]
        i = i * 2 + 1
        break
      }
      if (this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0) {
        this.data[i] = this.data[i * 2 + 1]
        i = i * 2 + 1
      } else {
        this.data[i] = this.data[i * 2 + 2]
        i = i * 2 + 2
      }
    }

    if (i < this.length - 1) {
      this.insertAt(i, this.data.pop())
    } else {
      this.data.pop()
    }

    return min
  }

  insert(value) {
    this.insertAt(this.length, value)
  }

  insertAt(index, value) {
    this.data[index] = value
    while (
      index > 0 &&
      this.compare(value, this.data[((index - 1) / 2) | 0]) < 0
    ) {
      this.data[index] = this.data[((index - 1) / 2) | 0]
      this.data[((index - 1) / 2) | 0] = value
      index = ((index - 1) / 2) | 0
    }
  }

  get length() {
    return this.data.length
  }
}
```
