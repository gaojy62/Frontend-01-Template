document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add')
  const deleteBtn = document.getElementById('delete')
  const moveBtn = document.getElementById('move')

  const myFrame = document.getElementById('my-frame')

  addBtn.addEventListener('click', e => {
    const newDom = document.createElement('div')
    newDom.style.width = '50px'
    newDom.style.height = '50px'
    newDom.style.position = 'fixed'
    newDom.style.right = `${getRandomNumber(0, 650)}px`
    newDom.style.top = `${getRandomNumber(0, 330)}px`
    newDom.style.borderRadius = '50%'
    newDom.style.background = `rgb(
      ${getRandomNumber(0, 256)},
      ${getRandomNumber(0, 256)},
      ${getRandomNumber(0, 256)}
    )`
    myFrame.contentWindow.document.body.append(newDom)
  })

  deleteBtn.addEventListener('click', e => {
    const frameDivs = myFrame.contentWindow.document.getElementsByTagName('div')
    if (frameDivs.length <= 0) {
      alert('没有东西可以删除了，真的一滴都没有了！')
      return
    }
    myFrame.contentDocument.body.removeChild(
      frameDivs[`${Math.floor(getRandomNumber(0, frameDivs.length))}`]
    )
  })

  moveBtn.addEventListener('click', e => {})

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
})
