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
        <!-- @blur:失去焦点时触发，默认中第一个城市 （handleDepartBlur这个文档没有，因为需求自己添加的）-->
        <el-autocomplete
        class="el-autocomplete"
        placeholder="请输入出发城市"
        v-model="form.departCity"
        :fetch-suggestions="queryDepartSearch"
        @select="handleDepartSelect"
        @blur="handleDepartBlur"
        ></el-autocomplete>
        </el-form-item>

    <!-- 到达城市框---------- -->
    <el-form-item label="到达城市">
      <el-autocomplete
      class="el-autocomplete"
      placeholder="到达城市"
      v-model="form.destCity"
      :fetch-suggestions="queryDestSearch"
      @select="handleDestSelect"
      @blur="handleDestBlur"
      ></el-autocomplete>
    </el-form-item>

     <!-- 出发时间框--------- -->
    <el-form-item label="出发时间">
        <!-- change用户确认选择日期时触发 -->
        <el-date-picker type="date"
        v-model="form.departDate"
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
//引入时间格式转换工具
import moment from 'moment';

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
        },
        //出发城市列表,方便handleDepartBlur获得newData，
        //因为与queryDepartSearch同一级不能用this方法,所有先存到data（），再使用this调用
        departData:[],

         // 到达城市列表,与出发城市同理
        destData: []
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
     //如果输入框没有值就直接返回
      if(!value){
        return;
      }
 
      //如果有值，就根据value请求城市列表
      this.$axios({
        //通过get请求上传value，再返回res
        url:'/airs/city',
        //axios的get请求的参数使用params，如果是post请求使用data
        params:{
          //将value值传个给name，即输入框内容给的mane上传
          name:value
        }
      }).then(res=>{
        // console.log(res);
        
        const {data}=res.data;

      //给data数组中每一项添加一个value属性（通过map遍历方法）
      //data数组是数组包对象的形式，因为element规定必须使用value：城市名
      //所有要给数组中每一项的对象里添加value（可以comsole.log(res)看看data结构）
      const newData=data.map(v=>{
        // 添加value的同时去掉“市”字，因为返回值有，但上传不需要
        v.value=v.name.replace('市','')
        //map返回的数组由return组成的
        return v;
      })

       //把newData保存到data中(方便handleDepartBlur调用)
       this.departData=newData;

       //callback将数组展示出来
        callback(newData)
        })
    },
    //输入完整出发城市失焦时触发（自己添加的需求，人人都是产品经理）
    handleDepartBlur(){
      if(this.departData.length===0){
        return;
      }

      //若输入完整城市名就默认获取数组第一个城市
      this.form.departCity=this.departData[0].value;
      this.form.departCdeo=this.departData[0].sort;
    } ,

    //目标城市输入块获得焦点时触发
    //value是选中的值，callback是回调函数，接收要展示的列表
    queryDestSearch(value,callback){
       if(!value){
                return;
            }
            // 根据value请求城市列表
            this.$axios({
                url: "/airs/city",
                params: {
                    name: value
                }
            }).then(res => {
                const {data} = res.data;
                const newData = data.map(v => {
                    v.value = v.name.replace("市", "");
                    return v;
                })
                // 把newData保存到data中(出了这里和出发城市不一样，函数内的其他代码和出发城市都是一样的)
                this.destData = newData;
                callback(newData);
            })
    },
    // 到达城市输入框失去焦点时候触发
        handleDestBlur(){
            if(this.destData.length === 0){
                return;
            }
            // 默认获取数组中第一个城市
            this.form.destCity =  this.destData[0].value;
            this.form.destCode =  this.destData[0].sort;
        },
    //点击出发城市下拉列表中的城市时触发
    handleDepartSelect(item){
      // console.log(item);
      //item返回是一个对象，里面有value和sort（是element-ui提供的）
      //
        this.form.departCity=item.value
        this.form.departCdeo=item.sort;
    },
    //目标城市下拉选择时触发
    handleDestSelect(item){
      // console.log(item);
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },
    //确认选择日期时触发
    handleDate(value){
      //修改时间的格式
      this.form.departDate=moment(value).format('YYYY-MM-DD')

    },
    //触发和目标城市切换时触发
    handleReverse(){

    },
    //提交表单时触发
    handleSubmit(){
    console.log(this.form)
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
