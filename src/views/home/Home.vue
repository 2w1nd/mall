<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="topTabControl" class="tab-control" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <featrure-view></featrure-view>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl"></tab-control>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native='backClick' v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  
  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommendView from './childComps/HomeRecommendView'
  import FeatrureView from './childComps/FeatrureView'
  import GoodsList from 'components/content/goods/GoodsList';
  import {itemListenerMixin} from 'common/mixin'

  export default {
    name: 'Home',
    mixins: [itemListenerMixin],
    data () {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView,
      FeatrureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      this.getHomeMultidata();

      this.getHomeGoods('pop');
      this.getHomeGoods('sell');
      this.getHomeGoods('new');
    },
    destroyed() {
      console.log('destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      // 2.取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    mounted() {

    },
    methods: {
      /**
       * 事件监听相关
       */
      tabClick(index) {
        switch (index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        // 让两个Tabcontrol的currentIndex保持一致
        this.$refs.topTabControl.currentIndex = index
        this.$refs.tabControl.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      contentScroll(position) {
        // 判断backtop是否显示
        this.isShowBackTop = -(position.y) > 600
        // 决定tabcontrol是否吸顶
        this.isTabFixed = -(position.y) > this.tabOffsetTop
      },
      loadMore() {
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)

        this.$refs.scroll.finishPullUp()
      },
      swiperImageLoad() {
        // 所有的组件都有一个属性$el，用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
        console.log(this.tabOffsetTop);
      },
      /**
       * 网络请求
       */
      getHomeMultidata() {
        // 1. 请求多个数据
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        // console.log(page);
        // 2.请求商品数据
        getHomeGoods(type,page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1
        })
      }
    }
  }
</script>

<style  scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /* 原生才需要 */
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }

  .content {
    height: calc(100% - 95px);
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
