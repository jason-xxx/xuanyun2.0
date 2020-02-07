<template>
  <div class="container">
    <!-- 使用element.ui中的走马灯组件展示轮播图 -->
    <el-carousel 
    :interval="5000"
    arrow="always">
    <!-- 遍历数组获取图片路径 -->
      <el-carousel-item 
      v-for="(item, index) in banners" :key="index">
      <!-- nuxt自动将axios绑定到实例所有可以直接调用$axios.defaults.baseURL -->
      <div class="banner-image"
      :style="`background:url(${$axios.defaults.baseURL}${item.url}) center center no-repeat;
      background-size:contain contain;`"></div>
      </el-carousel-item>
    </el-carousel>
      </div>
</template>

<script>
export default {
    data(){
        return {
            banners: [], // 轮播图数据
        }
    },
    mounted(){
        //因为nuxt已经将axios绑定在实例中，所有可以直接this
        //并通过api发送请求,
        //因为在nuxt.config.js-axios{}里配置过http:127.0.0.1:1337所有这里url不用加前缀
      this.$axios({
        url:'/scenics/banners'
      }).then(res=>{
          //通过.then(res=>{ console.log(res)看res事件源对象得到data})
          const{data}=res.data;
          this.banners=data;
      })
    }
}
</script>

<style scoped lang="less">
.container{
    min-width:1000px;
    margin:0 auto;
    position:relative;

    /deep/ .el-carousel__container{
        height:700px;
    }

    .banner-image{
        width:100%;
        height:100%;
    }
}
</style>