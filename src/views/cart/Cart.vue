<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <scroll class="content" ref="scroll"> 
      <cart-list></cart-list>
    </scroll>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  
  import CartList from './childComps/CartList'
  import Scroll from 'components/common/scroll/Scroll'
  import CartBottomBar from './childComps/CartBottomBar'
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'Cart',
    data () {
      return {
      }
    },
    components: {
      NavBar,
      CartList,
      Scroll,
      CartBottomBar
    },
    computed: {
      // return this.$store.getters.cartLength
      ...mapGetters(
        ['cartLength'] 
      )
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  } 
</script>

<style  scoped>
  #cart {
    position: relative;
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
  }

  .content {
    height: calc(100% - 44px - 49px - 40px);
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
