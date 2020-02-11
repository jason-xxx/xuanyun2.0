<template>
  <div class="search-form">
    <el-row type="flex" class="search-tab">
    <!-- 头部tab切换———————————————————————————————————— -->
    <span v-for="(value,index) in tabArr" :key='index'
    @click="handleSearchTab(value,index)"
    :class="{active: index===suoyin}">
     <i :class="value.icon">{{value.name}}</i>
    </span>
    </el-row>
     
    <!-- 单程———————————————————————————————————————————— -->
    <el-form class="search-form-content" ref="form" 
    v-if="suoyin==0" label-width="80px">
    <!-- 出发框城市----------- -->
    <el-form-item label='出发城市'>
        <!-- fetch-suggestions 监听输入框的输入，可以在这事件请求api(输入“广”字提示广州等..) -->
        <!-- select点击选中建议时触发，即点击出发城市下拉列表中的城市时触发 -->
        <el-autocomplete
        class="el-autocomplete"
        placeholder="请输入出发城市"
        v-model="form.departCity"
        :fetch-suggestions="queryDepartSearch"
        @select="handleDepartSelect"
        ></el-autocomplete>
        </el-form-item>

    <!-- 到达城市框---------- -->
    <el-form-item label="到达城市">
      <el-autocomplete
      class="el-autocomplete"
      placeholder="到达城市"
      :fetch-suggestions="queryDestSearch"
      @select="handleDestSelect"
      ></el-autocomplete>
    </el-form-item>

     <!-- 出发时间框--------- -->
    <el-form-item label="出发时间">
        <!-- change用户确认选择日期时触发 -->
        <el-date-picker type="date"
        placeholder="请选择时间"
        style="width:100%"
        @change='handleDate'>
        </el-date-picker>
    </el-form-item>

    <!-- 搜索按钮------------ -->
    <el-form-item>
      <el-button style="width:100%"
      type="primary"
      icon="el-icon-search"
      @click='handleSubmit'>
      搜索
      </el-button>
    </el-form-item>

    <!-- 换--- -->
    <div class="reverse">
        <span @click='handleReverse'>
        换
        </span>
    </div>

   </el-form>

     <!-- 双程———————————————————————————————————————未启用-->
    <div v-if="suoyin==1" class="wangfan">
    目前暂不支持往返，请使用单程选票！
    </div>  
  </div>
  
</template>

<script>
export default {
data(){
    return{
      //索引
        suoyin:0,
        tabArr:[
            {
            icon:"iconfont icondancheng",
            name:'单程'
            },
           {icon:"iconfont iconshuangxiang",
            name:'往返'}
        ],
        form:{
          departCity:'',
          departCdeo:'',
          destCity:'',
          destCode:'',
          departDate:''
        }
    }
},
methods:{
    //tab栏切换
    handleSearchTab(item,index){
         this.suoyin=index
    },
    //出发城市输入框获得焦点时触发，列表下拉出现推荐城市
    //value是选中的值，callback是回调函数，接收要展示的列表
    queryDepartSearch(value,callback){
      console.log(value);
      
      // 模拟请求回来的数组
      callback([
          {value:'广州',sort:'CAN'},
          {value:'广元',sort:'sui'},
          {value:'广安',sort:'bain'}
      ])
    },
    
    //目标城市输入块获得焦点时触发
    //value是选中的值，callback是回调函数，接收要展示的列表
    queryDestSearch(value,callback){
        callback([
            {value:1},
            {value:2},
            {value:3}
        ])
    },
    //点击出发城市下拉列表中的城市时触发
    handleDepartSelect(item){
      // console.log(item);
      //item返回是一个对象，里面有value和sort（是element-ui提供的）
      
        this.form.departCity=item.value
        this.form.departCdeo=item.sort;
    },
    //目标城市下拉选择时触发
    handleDestSelect(item){

    },
    //确认选择日期时触发
    handleDate(value){

    },
    //触发和目标城市切换时触发
    handleReverse(){

    },
    //提交表单时触发
    handleSubmit(){

    }
    },
    mounted(){
        
    }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
.wangfan{
    font-weight: 700;
    height:300px;
    display: flex; 
    font-size: 18px;   
    align-items: center;
    justify-content: space-around;  
}
</style>
