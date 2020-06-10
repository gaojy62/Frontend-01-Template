function removeEmpty(inputJSON) {
  let objJSON = JSON.parse(inputJSON)
  const foo = function (objJSON) {
    for (let key in objJSON) {
      if (Object.prototype.toString.call(objJSON[key]) === '[object Object]')
        foo(objJSON[key])
      if (Object.prototype.toString.call(objJSON[key]) === '[object Array]')
        for (let index = 0; index < objJSON[key].length; index++) {
          foo(objJSON[key][index])
          if (
            JSON.stringify(objJSON[key][index]) === '{}' ||
            JSON.stringify(objJSON[key][index]) === '[]'
          ) {
            objJSON[key].splice(index--,1)
          }
        }
      if (
        objJSON[key] === null ||
        /^[\s]*$/.test(objJSON[key]) ||
        JSON.stringify(objJSON[key]) === '[]' ||
        JSON.stringify(objJSON[key]) === '{}'
      )
        delete objJSON[key]
    }
  }
  foo(objJSON)
  return JSON.stringify(objJSON)
}

var ret = JSON.parse(
  removeEmpty(
    '{"first_name":"Jane","last_name":"Smith","email":"jane.smith@wyng.com","gender":null,"invitations":[{"from":"","code":null,"arr":[{"from":"1","code":""}]},{"from":"66","code":""}],"company":{"name":"","industries":[]},"address":{"city":"New York","state":"NY","zip":"10011","street":"     "}}'
  )
)
console.log(ret)
