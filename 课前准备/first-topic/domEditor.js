document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add')
  const deleteBtn = document.getElementById('delete')
  const moveBtn = document.getElementById('move')

  const myFrame = document.getElementById('my-frame')

  addBtn.addEventListener('click', e => {
    const newDom = document.createElement('div')
    newDom.style.cssText = `width:50px;height:50px;position:fixed;right:${getRandomNumber(0, 650)}px;top:${getRandomNumber(0, 330)}px;border-radius:50%;background:rgb(${getRandomNumber(0, 255)},${getRandomNumber(0, 255)},${getRandomNumber(0, 255)})`
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

  moveBtn.addEventListener('click', e => {
  })

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }
})
