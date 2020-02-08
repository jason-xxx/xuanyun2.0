<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
   <!-- 用户名输入框 -->
    <el-form-item class="form-item">
      <el-input placeholder="用户名/手机">
      </el-input>
    </el-form-item>
   <!-- 密码输入框 -->
    <el-form-item class="form-item">
      <el-input placeholder="密码" type="password">
      </el-input>
    </el-form-item>
   <!-- 忘记密码 -->
   <p class="from-text">
     <nuxt-link to="#">忘记密码</nuxt-link>
   </p>

   <!-- 登录按钮 -->
   <el-button class="submit" type="primary"
   @click="handleLoginSubmit">登录</el-button>

  </el-form>
</template>

<script>
export default {
  data(){
      return{
          //表单的数据
          form:{},
          //表单规则
          reles:{},
      }
  },
  methods:{
      //提交登录
      handleLoginSubmit(){
          console.log(this.form);
      }
  }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }
    .form-item{
        margin-bottom:20px;
    }
    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }
    .submit{
        width:100%;
        margin-top:10px;
    }
</style>