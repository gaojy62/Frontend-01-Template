function partition(arr = [], pivot, left, right) {
  const pivotValue = arr[pivot]
  let startIndex = left
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      ;[arr[i], arr[startIndex]] = [arr[startIndex], arr[i]]
      startIndex++
    }
  }
  ;[arr[pivot], arr[startIndex]] = [arr[startIndex], arr[pivot]]
  return startIndex
}

function _quickSort(arr, left, right) {
  if (left >= right) return
  const pivot = right
  const q = partition(arr, pivot, left, right)
  _quickSort(arr, left, q - 1 < left ? left : q - 1)
  _quickSort(arr, q + 1 > right ? right : q + 1, right)
}

function quickSort(arr = []) {
  if (arr.length <= 1) {
    return arr
  }
  _quickSort(arr, 0, arr.length - 1)
}

var testArr = []
let i = 0
while (i < 100) {
  testArr.push(Math.floor(Math.random() * 1000))
  i++
}
console.log(testArr)
quickSort(testArr)
console.log(testArr)
