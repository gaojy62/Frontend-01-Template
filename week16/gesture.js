function gesture(element) {
  let context = Object.create(null)

  const MOUSE_SYMBOL = Symbol('mouse')

  if (document.ontouchstart !== null) {
    element.addEventListener('mousedown', (event) => {
      context[MOUSE_SYMBOL] = Object.create(null)
      start(event, context[MOUSE_SYMBOL])
      let mouseMove = (event) => {
        move(event, context[MOUSE_SYMBOL])
      }
      let mouseEnd = (event) => {
        end(event, context[MOUSE_SYMBOL])
        element.removeEventListener('mousemove', mouseMove)
        element.removeEventListener('mouseup', mouseEnd)
      }
      element.addEventListener('mousemove', mouseMove)
      element.addEventListener('mouseup', mouseEnd)
    })
  }

  element.addEventListener('touchstart', (event) => {
    for (let touch of event.changedTouches) {
      context[touch.identifier] = Object.create(null)
      start(touch, context[touch.identifier])
    }
  })

  element.addEventListener('touchmove', (event) => {
    for (let touch of event.changedTouches) {
      move(touch, context[touch.identifier])
    }
  })

  element.addEventListener('touchend', (event) => {
    for (let touch of event.changedTouches) {
      end(touch, context[touch.identifier])
      delete context[touch.identifier]
    }
  })

  element.addEventListener('touchcancel', (event) => {
    for (let touch of event.changedTouches) {
      cancel(touch, context[touch.identifier])
      delete context[touch.identifier]
    }
  })

  let start = (point, context) => {
    element.dispatchEvent(
      new CustomEvent('start', {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    )
    context.startX = point.clientX
    context.startY = point.clientY
    context.moves = []
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.timoutHandler = setTimeout(() => {
      if (context.isPan) return
      context.isTap = false
      context.isPan = false
      context.isPress = true
      element.dispatchEvent(new CustomEvent('pressstart', {}))
    }, 500)
  }

  let move = (point, context) => {
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      if (context.isPress) {
        element.dispatchEvent(new CustomEvent('presscancel', {}))
      }

      context.isTap = false
      context.isPan = true
      context.isPress = false

      element.dispatchEvent(
        new CustomEvent('panstart', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        })
      )
    }

    if (context.isPan) {
      context.moves.push({
        dx,
        dy,
        t: Date.now(),
      })
      context.moves = context.moves.filter(
        (record) => Date.now() - record.t < 300
      )

      let e = new CustomEvent('pan')
      Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
      element.dispatchEvent(e)
    }
  }

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX
      let dy = point.clientY - context.startY
      let record = context.moves[0]
      let speed =
        Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
        (Date.now() - record.t)
      let isFlick = speed > 2.5
      if (isFlick) {
        element.dispatchEvent(
          new CustomEvent('filck', {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed,
          })
        )
      }
      element.dispatchEvent(
        Object.assign(new CustomEvent('panend'), {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed,
          isFlick,
        })
      )
    }
    if (context.isTap) element.dispatchEvent('tap', {})
    if (context.isTap) element.dispatchEvent('pressend', {})
    clearTimeout(context.timoutHandler)
  }

  let cancel = (point, context) => {
    element.dispatchEvent(new CustomEvent('canceled', {}))
    clearTimeout(context.timoutHandler)
  }
}
