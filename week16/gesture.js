const body = document.body

let context = Object.create(null)

let MOUSE_SYMBOL = Symbol('mouse')

if (document.ontouchstart !== null) {
  body.addEventListener('mousedown', event => {
    context[MOUSE_SYMBOL] = Object.create(null)
    start(event, context[MOUSE_SYMBOL])
    let mouseMove = event => {
      move(event, context[MOUSE_SYMBOL])
    }
    let mouseEnd = event => {
      end(event, context[MOUSE_SYMBOL])
      body.removeEventListener('mousemove', mouseMove)
      body.removeEventListener('mouseup', mouseEnd)
    }
    body.addEventListener('mousemove', mouseMove)
    body.addEventListener('mouseup', mouseEnd)
  })
}

body.addEventListener('touchstart', event => {
  for (let touch of event.changedTouches) {
    context[touch.identifier] = Object.create(null)
    start(touch, context[touch.identifier])
  }
})

body.addEventListener('touchmove', event => {
  for (let touch of event.changedTouches) {
    move(touch, context[touch.identifier])
  }
})

body.addEventListener('touchend', event => {
  for (let touch of event.changedTouches) {
    end(touch, context[touch.identifier])
    delete context[touch.identifier]
  }
})

body.addEventListener('touchcancel', event => {
  for (let touch of event.changedTouches) {
    cancel(touch, context[touch.identifier])
    delete context[touch.identifier]
  }
})

let start = (point, context) => {
  context.startX = point.clientX
  context.startY = point.clientY
  context.isTap = true
  context.isPan = false
  context.isPress = false
  context.timoutHandler = setTimeout(() => {
    if (context.isPan) return
    context.isTap = false
    context.isPan = false
    context.isPress = true
  }, 500)
}

let move = (point, context) => {
  let dx = point.clientX - context.startX
  let dy = point.clientY - context.startY

  if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
    context.isTap = false
    context.isPan = true
    context.isPress = false
  }
  if (context.isPan) console.log('pan')
}

let end = (point, context) => {
  if (context.isPan) console.log('panend')
  if (context.isTap) console.log('tapend')
  if (context.isPress) console.log('pressend')
  clearTimeout(context.timoutHandler)
}

let cancel = (point, context) => {
  console.log('cancel')
  clearTimeout(context.timoutHandler)
}
