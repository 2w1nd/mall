<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll"  @scroll="contentScroll" :probe-type="3">
      <!-- 传入值要-不能驼峰 -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import Scroll from 'components/common/scroll/Scroll.vue'
  import GoodsList from 'components/content/goods/GoodsList'
  // import Toast from 'components/common/toast/Toast'

  import {BACKTOP_DISTANCE} from 'common/const'
  import {debouce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'

  import {mapActions} from 'vuex'

  export default {
    name: 'Detail',
    mixins: [itemListenerMixin, backTopMixin],
    data () {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast
    },
    created() {
      this.iid = this.$route.params.iid

      // 根据iid请求详情数据
      getDetail(this.iid).then(res =>{
        // console.log(res)
        const data = res.result
        this.topImages = res.result.itemInfo.topImages

        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 获取店铺信息
        this.shop = new Shop(data.shopInfo)

        // 保存商品详情数据
        this.detailInfo = data.detailInfo

        // 获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        // 取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        this.$nextTick(() => {
       
        })
      })
      // 取出推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })  
    },
    mounted() {
    
    },
    updated() {

    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh() 

        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs);
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },
      contentScroll(position) {
        // 1. 获取y值
        const positionY = -position.y

        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          if (this.currentIndex !== i && ((positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]))) {
            this.currentIndex = i 
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

         // 判断backtop是否显示
        this.isShowBackTop = -(position.y) > BACKTOP_DISTANCE
      },
      addToCart() {
        // console.log('添加到购物车中');
        // 获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 将商品添加进购物车
        // this.$store.dispatch('addCart', product)

        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res

          // setTimeout(() => {
          //   this.show = false
          // }, 1500);
          // console.log(this.$toast);
          this.$toast.show(res, 2000)
        })
      }
    }
  }
</script>

<style  scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
