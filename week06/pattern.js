function mathc(pattern, string) {
  const stateMap = {
    strat(c) {
      if (c === pattern[0]) {
        return stateMap.found1
      } else {
        return stateMap.strat
      }
    },
    end(c) {
      return stateMap.end
    },
  }
  const next = [-1]
  let i = 0,
    j = -1
  while (i < pattern.length) {
    if (j === -1 || pattern[i] === pattern[j]) {
      i++
      j++
      next[i] = j
    } else {
      j = next[j]
    }
  }
  console.log(next)
  for (let i = 1; i < pattern.length; i++) {
    stateMap[`found${i}`] = (c) => {
      if (c === pattern[i]) {
        if (i === pattern.length - 1) {
          return stateMap.end
        } else {
          return stateMap[`found${i + 1}`]
        }
      } else {
        return stateMap[`found${i - next[i+1]}`]
      }
    }
  }

  let state = stateMap.strat
  for (let c of string) {
    state = state(c)
  }
  return state === stateMap.end
}
console.log(mathc('aabbcc', 'aabbaabbaabbcc'))
