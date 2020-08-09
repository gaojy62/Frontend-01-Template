import { createElement, Text, Wrapper } from './createElement'
import { Carousel } from './carousel'
import { ListView } from './listView'

import css from './carousel.css'

console.log(css)

// let data = [
//   {url:'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',title:'1'},
//   {url:'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',title:'2'},
//   {url:'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',title:'3'},
//   {url:'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',title:'4'},
// ]

let component = (
  <Carousel
    class="carousel"
    data={[
      ' https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg ',
      ' https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg ',
      ' https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg ',
      ' https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg ',
    ]}
  ></Carousel>
)

// let list = (
//   <ListView data={data}>
//     {item => (
//       <figure>
//         <img src={item.url} />
//         <figcaption>{item.title}</figcaption>
//       </figure>
//     )}
//   </ListView>
// )

component.mountTo(document.body)
