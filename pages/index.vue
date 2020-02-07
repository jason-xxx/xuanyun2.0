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

    <!-- 添加搜索框 -->
    <div class="banner-content">
      <div class="search-bar">

        <!-- tab栏 ---------------------->
        <el-row type="flex" class="search-tab">
            <!-- 遍历数组 -->
          <span v-for="(value,index) in options" :key="index"
          @click="handleClick(index)"
          :class="{active:current===index}">
          <!-- 以上是v-bind class绑定 active是tab高亮的样式 
          即当current（设定索引）===index（遍历索引）时，添加此样式
          即点击会触发current=index的事件，所有点击哪个哪个就高亮-->
            <i>{{value.name}}</i>    
          </span>
        </el-row>

        <!--tab栏下的输入框 -------------------->
        <el-row type="flex" align="middle" class="search-input">
            <!-- :placeholder动态绑定 -->
          <input type="text" 
          :placeholder="options[current].placeholder">
          <i class="el-icon-search"></i>
        </el-row>

      </div>
    </div>
      </div>
</template>

<script>
export default {
    data(){
        return {
            banners: [], // 轮播图数据
            options:[
                {
                  name:'攻略',
                  placeholder:'搜索城市'
                },
                {
                  name:'酒店',
                  placeholder:'请输入城市搜索酒店'
                },
                {
                  name:'机票',
                  placeholder:''
                }
            ],
        //重要的索引,先定义为0！！！！！！！！！！
        current:0
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
    },
    methods:{
      //点击tab栏时的事件，重点在修改current索引
      //每点击一次会得到遍历对应的索引index，然后将index赋值给current
      handleClick(index){
          this.current=index;
      }
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

    .banner-content{
        z-index:9;
        width:1000px;
        position:absolute;
        left:50%;
        top:45%;
        margin-left: -500px;
        border-top:1px transparent solid;

        .search-bar{
            width:552px;
            margin:0 auto;
        }

        .search-tab{
            .active{
                i{
                color:#333;
                }
                &::after{
                background: #eee;
                }
            }

            span{
                width:82px;
                height:36px;
                display:block;
                position: relative;
                margin-right:8px;
                cursor: pointer;

                i{
                position:absolute;
                z-index:2;
                display: block;
                width:100%;
                height:100%;
                line-height:30px;
                text-align:center;
                color:#fff;
                }

                &:after{
                position: absolute;
                left:0;
                top:0;
                display:block;
                content: "";
                width:100%;
                height:100%;
                border: 1px rgba(255,255,255,.2) solid;
                border-bottom: none;
                transform: scale(1.1,1.3) perspective(.7em) rotateX(2.2deg);
                transform-origin: bottom left;
                background: rgba(0,0,0,.5);
                border-radius:1px 2px 0 0;
                box-sizing:border-box;
                }
            }
        }

        .search-input{
            width:550px;
            height:46px;
            background:#fff;
            border-radius: 0 4px 4px 4px;
            border: 1px rgba(255,255,255,.2) solid;
            border-top:none;
            box-sizing: unset;

            input{
                flex:1;
                height:20px;
                padding: 13px 15px;
                outline: none;
                border:0;
                font-size:16px;
            }

            .el-icon-search{
                cursor :pointer;
                font-size:22px;
                padding:0 10px;
                font-weight:bold;
            }
        }
    }
}
</style>