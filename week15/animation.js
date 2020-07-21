export class Timeline {
  constructor() {
    this.animations = []
    this.requestID = null
  }
  tick() {
    let t = Date.now() - this.startTime
    let animations = this.animations.filter(animation => !animation.finished)
    for (let animation of this.animations) {
      let {
        object,
        property,
        template,
        start,
        end,
        duration,
        delay,
        timingFunction
      } = animation

      let progression = timingFunction((t - delay) / duration)
      if (t > animation.duration + animation.delay) {
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
    this.pauseTime = Date.now()
    if (this.requestID != null) {
      cancelAnimationFrame(this.requestID)
    }
  }

  resume() {
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }

  start() {
    this.startTime = Date.now()
    this.tick()
  }

  add(animation) {
    this.animations.push(animation)
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
