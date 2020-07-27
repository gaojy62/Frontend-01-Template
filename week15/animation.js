export class Timeline {
  constructor() {
    this.inited = Symbol('inited')
    this.playing = Symbol('playing')
    this.paused = Symbol('paused')

    this.animations = []
    this.requestID = null
    this.state = this.inited
  }
  tick() {
    let t = Date.now() - this.startTime

    let animations = this.animations.filter((animation) => !animation.finished)

    for (let animation of this.animations) {
      let {
        object,
        property,
        template,
        start,
        end,
        duration,
        delay,
        timingFunction,
        addTime,
      } = animation

      let progression = 0
      if (t - delay - addTime < 0) {
        progression = 0
      } else {
        progression = timingFunction((t - delay - addTime) / duration)
      }

      if (t > duration + delay + addTime) {
        progression = 1
        animation.finished = true
      }

      let value = start + progression * (end - start)

      object[property] = template(value)
    }
    if (animations.length) {
      this.requestID = requestAnimationFrame(() => this.tick())
    }
  }

  pause() {
    if (this.state !== this.playing) return
    this.state = this.paused
    this.pauseTime = Date.now()
    if (this.requestID != null) {
      cancelAnimationFrame(this.requestID)
    }
  }

  resume() {
    if (this.state !== this.paused) return
    this.state = this.playing
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }

  start() {
    if (this.state !== this.inited) return
    this.state = this.playing
    this.startTime = Date.now()
    this.tick()
  }

  restart() {
    if (this.state === this.playing) this.pause()
    // this.animations = []
    this.startTime = Date.now()
    this.requestID = null
    this.pauseTime = null
    this.state = this.playing
    this.animations.forEach((animation) => {
      animation.finished = false
    })
    this.tick()
  }

  add(animation, addTime) {
    this.animations.push(animation)
    animation.finished = false
    if (this.state === this.playing) {
      animation.addTime =
        addTime != void 0 ? addTime : Date.now() - this.startTime
    } else {
      animation.addTime = addTime != void 0 ? addTime : 0
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    template,
    start,
    end,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object
    this.template = template
    this.property = property
    this.start = start
    this.end = end
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
  }
}
