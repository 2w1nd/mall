import {debounce} from "./utils"
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  mounted() {
    // 监听item图片加载
    const refresh = debounce(this.$refs.scroll.refresh,500)

    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('我是混入的内容');
  }
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300);
    }
  }
}
