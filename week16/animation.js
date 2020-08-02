export class Timeline {
  constructor() {
    this.animations = new Set()
    this.finishedAnimations = new Set()
    this.addTimes = new Map()
    this.inited = Symbol('inited')
    this.playing = Symbol('playing')
    this.paused = Symbol('paused')

    this.requestID = null
    this.state = this.inited
  }
  tick() {
    let t = Date.now() - this.startTime

    for (let animation of this.animations) {
      let {
        object,
        property,
        template,
        duration,
        delay,
        timingFunction,
      } = animation

      let addTime = this.addTimes.get(animation)

      let progression = 0
      if (t - delay - addTime < 0) {
        progression = 0
      } else {
        progression = timingFunction((t - delay - addTime) / duration)
      }

      if (t > duration + delay + addTime) {
        progression = 1
        this.animations.delete(animation)
        this.finishedAnimations.add(animation)
      }

      let value = animation.valueFromProgression(progression)

      object[property] = template(value)
    }
    if (this.animations.size) {
      this.requestID = requestAnimationFrame(this.tick)
    } else {
      this.requestID = null
    }
  }

  pause() {
    if (this.state !== this.playing) return
    this.state = this.paused
    this.pauseTime = Date.now()
    if (this.requestID != null) {
      cancelAnimationFrame(this.requestID)
      this.requestID = null
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

  reset() {
    if(this.state === this.playing) {
      this.pause()
    }
    this.animations = new Set()
    this.finishedAnimations = new Set()
    this.addTimes = new Map()
    this.startTime = Date.now()
    this.requestID = null
    this.pauseTime = null
    this.state = this.inited
    this.tick()
  }
  
  restart() {
    if (this.state === this.playing) this.pause()
    for (let animation of this.finishedAnimations) {
      this.animations.add(animation)
    }
    this.finishedAnimations = new Set()
    this.startTime = Date.now()
    this.requestID = null
    this.pauseTime = null
    this.state = this.playing
    this.tick()
  }

  add(animation, addTime) {
    this.animations.add(animation)
    if (this.state === this.playing && this.requestID === null) {
      this.tick()
    }
    if (this.state === this.playing) {
      this.addTimes.set(
        animation,
        addTime !== void 0 ? addTime : Date.now() - this.startTime
      )
    } else {
      this.addTimes.set(
        animation,
        addTime !== void 0 ? addTime : 0
      )
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    start,
    end,
    duration,
    delay,
    timingFunction,
    template
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
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start)
  }
}
