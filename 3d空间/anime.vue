<template>
  <div class="anime"
       @touchstart.prevent="start"
       @touchmove.prevent="move"
       @touchend="end">
    <div class="bone"
         ref="bone">
      <div class="box">
        <div>前</div>
        <div>后</div>
        <div>左</div>
        <div>右</div>
        <div>上</div>
        <div>下</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class Anime extends Vue {
  touch: any = {
    startX: 0,
    startY: 0,
    rotateY: 0,
    rotateX: 0,
    fn: 0.4
  };
  start(e: TouchEvent) {
    const touch = e.touches[0];
    this.touch.startX = touch.pageX;
    this.touch.startY = touch.pageY;
  }
  move(e: TouchEvent) {
    const touch = e.touches[0];
    const deltaX = (this.touch.startX - touch.pageX) * this.touch.fn;
    const deltaY = (touch.pageY - this.touch.startY) * this.touch.fn;

    const rotateX = this.touch.rotateX + deltaX;
    const rotateY = this.touch.rotateY + deltaY;

    const bone = this.$refs.bone as any;
    bone.style.transform = `translateZ(-100px) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`;
  }
  end(e: TouchEvent) {
    const touch = e.changedTouches[0];
    this.touch.rotateX += (this.touch.startX - touch.pageX) * this.touch.fn;
    this.touch.rotateY += (touch.pageY - this.touch.startY) * this.touch.fn;
  }
}
</script>

<style lang="stylus" scoped>
.anime
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  perspective 300px
  transform-style preserve-3d
  overflow hidden
  .bone
    width 100%
    height 100%
    transform-style preserve-3d
    position relative
    transition 1.5s
    transform translateZ(-100px) rotate3d(0, 0, 0)
    .box
      position absolute
      left 50%
      top 50%
      margin -1200px 0 0 -1200px
      font-size 42px
      color #ffffff
      text-align center
      line-height 2400px
      div
        width 2400px
        height 2400px
        position absolute
        top 0
        left 0
      div:nth-of-type(1)
        // background-color #ff0000
        background url('../img/front.jpg') no-repeat
        background-size 100% 100%
        transform translateZ(1200px)
      div:nth-of-type(2)
        // background-color #00ff00
        background url('../img/back.jpg') no-repeat
        background-size 100% 100%
        transform translateZ(-1200px) rotateY(180deg)
      div:nth-of-type(3)
        // background-color #0000ff
        background url('../img/left.jpg') no-repeat
        background-size 100% 100%
        transform translateX(-1200px) rotateY(-90deg)
      div:nth-of-type(4)
        // background-color #ff00ff
        background url('../img/right.jpg') no-repeat
        background-size 100% 100%
        transform translateX(1200px) rotateY(90deg)
      div:nth-of-type(5)
        // background-color #00ffff
        background url('../img/top.jpg') no-repeat
        background-size 100% 100%
        transform translateY(-1200px) rotateX(90deg)
      div:nth-of-type(6)
        // background-color #666666
        background url('../img/bottom.jpg') no-repeat
        background-size 100% 100%
        transform translateY(1200px) rotateX(-90deg)
</style>