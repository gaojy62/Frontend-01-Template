export class Carousel {
  constructor(config) {
    // this.children = []
    // this.slot = <div></div>
  }

  setAttribute(name, value) {
    // this.slot.setAttribute(name, value)
    this[name] = value
  }

  // appendChild(child) {
  //   this.children.push(child)
  // }

  render() {
    let children = this.data.map(url => {
      let element = <img src={url} />
      element.addEventListener('dragstart', e => e.preventDefault())
      return element
    })
    let root = <div id = {this.id || ''} class={this.class}>{children}</div>

    let position = 0
    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length

      let current = children[position]
      let next = children[nextPosition]

      // 立马让-100位置的图片到100的位置去，不要动画
      // 这样每次看起来都是从右向左过渡动画
      current.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'
      current.style.transform = `translateX(${-100 * position}%)`
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

      setTimeout(function () {
        // transition 写在css里面，方便用css控制动画执行效果
        current.style.transition = ''
        next.style.transition = ''
        current.style.transform = `translateX(${-100 - 100 * position}%)`
        next.style.transform = `translateX(${-100 * nextPosition}%)`

        position = nextPosition
      }, 16)

      setTimeout(nextPic, 3000)
    }
    setTimeout(nextPic, 3000)

    // 鼠标拖拽
    root.addEventListener('mousedown', event => {
      let startX = event.clientX
      let startY = event.clientY

      let lastPosition = (position - 1 + this.data.length) % this.data.length
      let nextPosition = (position + 1) % this.data.length

      let current = children[position]
      let last = children[lastPosition]
      let next = children[nextPosition]

      current.style.transition = 'ease 0s'
      last.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'

      current.style.transform = `translateX(${0 - 500 * position}px)`
      last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`

      let move = event => {
        current.style.transform = `translateX(${
          event.clientX - startX - 500 * position
        }px)`
        last.style.transform = `translateX(${
          event.clientX - startX - 500 - 500 * lastPosition
        }px)`
        next.style.transform = `translateX(${
          event.clientX - startX + 500 - 500 * nextPosition
        }px)`
      }

      let up = event => {
        let offset = 0

        if (event.clientX - startX > 250) {
          offset = 1
        } else if (event.clientX - startX < -250) {
          offset = -1
        }

        current.style.transition = ''
        last.style.transition = ''
        next.style.transition = ''

        current.style.transform = `translateX(${
          offset * 500 - 500 * position
        }px)`
        last.style.transform = `translateX(${
          offset * 500 - 500 - 500 * lastPosition
        }px)`
        next.style.transform = `translateX(${
          offset * 500 + 500 - 500 * nextPosition
        }px)`

        position = (position - offset + this.data.length) % this.data.length

        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    return root
  }

  mountTo(parent) {
    // this.slot = <div></div>
    // for (let child of this.children) {
    //   this.slot.appendChild(child)
    // }
    this.render().mountTo(parent)
  }
}
