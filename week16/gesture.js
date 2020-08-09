export function gesture(element) {
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
        console.log('mouse up')
        end(event, context[MOUSE_SYMBOL])
        element.removeEventListener('mousemove', mouseMove)
        element.removeEventListener('mouseup', mouseEnd)
        context[MOUSE_SYMBOL] = Object.create(null)
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
    // 分发 start 事件，表示手势操作的开始
    element.dispatchEvent(
      new CustomEvent('start', {
        startX: point.clientX,
        startY: point.clientY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
    )

    // 记录起始位置
    context.startX = point.clientX
    context.startY = point.clientY

    // 用于记录移动距离
    context.moves = []

    // 初始化状态
    context.isTap = true
    context.isPan = false
    context.isPress = false

    // 500毫秒后，如果还没有变为 pan 则由 tap 变为 press
    context.timoutHandler = setTimeout(() => {
      if (context.isPan) return
      context.isTap = false
      context.isPan = false
      context.isPress = true
      // 分发 pressstart 事件
      element.dispatchEvent(new CustomEvent('pressstart', {}))
    }, 500)
  }

  let move = (point, context) => {
    let dx = point.clientX - context.startX
    let dy = point.clientY - context.startY

    // 如果移动距离大于 10px 则进入 panstart 状态
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      // 如果之前的状态为 pressstart ，则分发一个 presscancel 事件，表示由 press 进入 pan
      if (context.isPress) {
        element.dispatchEvent(new CustomEvent('presscancel', {}))
      }

      // 更改状态
      context.isTap = false
      context.isPan = true
      context.isPress = false

      // 分发 panstart 事件
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
      // 记录每次移动的信息，用于后边计算移动速度
      context.moves.push({
        dx,
        dy,
        t: Date.now(),
      })
      // 只取最后一次移动 300 毫秒之内的数据用于计算移动速度
      context.moves = context.moves.filter(
        (record) => Date.now() - record.t < 300
      )
      // 每次移动后向外分发一个 pan 事件
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
      // 计算移动速度
      let speed =
        Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
        (Date.now() - record.t)
      // 移动速度大于 2.5 的被认为是 flick 事件
      let isFlick = speed > 2.5
      // 分发 flick 事件
      if (isFlick) {
        element.dispatchEvent(
          Object.assign(new CustomEvent('flick'), {
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
    // 如果到结束状态都是 tap ，则只向外分发一个 tap 事件，通常 tap 事件不需要太多信息
    if (context.isTap) element.dispatchEvent('tap', {})
    // press 状态同 tap
    if (context.isTap) element.dispatchEvent('pressend', {})
    // 最后清除用于记录是否为切换为 pressstart 的计时器
    clearTimeout(context.timoutHandler)
  }

  // 用于异常结束手势操作
  let cancel = (point, context) => {
    element.dispatchEvent(new CustomEvent('canceled', {}))
    clearTimeout(context.timoutHandler)
  }
}
