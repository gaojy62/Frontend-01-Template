# 第十五周总结

## SFC

作业文件在 week14 目录下

主要通过 parse 把 SFC 文件解析成类似于 AST 的树，然后通过 load 把这个树解析成真正的 dom 树

## Animation

css 动画比较难控制，所以引入 js 来解决动画不可控的问题

使用 `Animation` 设置动画的状态，如：持续事件，timingFunction 等

引入 `TimeLine` 来控制动画的暂停，开始等

在 `TimeLine` 内使用 `requestAnimationFrame` 实现动画开始，使用 `cancelAnimationFrame` 实现动画的暂停或结束