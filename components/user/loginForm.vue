<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
   <!-- 用户名输入框 ----------------------------------->
    <el-form-item class="form-item" prop="username">
        <!-- 新增v-model做双向绑定用户名-->
      <el-input placeholder="用户名/手机"
      v-model="form.username">
      </el-input>
    </el-form-item>

   <!-- 密码输入框 ------------------------------------->
    <el-form-item class="form-item" prop="password">
        <!-- 新增v-model做双向绑定密码 -->
      <el-input placeholder="密码" type="password"
      v-model="form.password">
      </el-input>
    </el-form-item>

   <!-- 忘记密码 --------------------------------------->
   <p class="from-text">
     <nuxt-link to="#">忘记密码</nuxt-link>
   </p>

   <!-- 登录按钮 ---------------------------------------->
   <el-button class="submit" type="primary"
   @click="handleLoginSubmit">登录</el-button>

  </el-form>
</template>

<script>
export default {
  data(){
      return{
          //表单的数据
          form:{
              username:'',//用户名
              password:''//密码
          },
          //表单验证规则
          rules:{
               username: [
                { 
                    required: true, 
                    message: '请输入用户名', 
                    trigger: 'blur' 
                },
            ],
            password: [
                { 
                    required: true, 
                    message: '请输入密码', 
                    trigger: 'blur' 
                },
            ]
          },
      }
  },
  methods:{
      //提交登录
      handleLoginSubmit(){
          //el-form自带一个validate的方法用于数据验证
          this.$refs.form.validate(valid=>{
              if(valid){
                //提交到登录接口
                //   this.$axios({
                //       url:'/accounts/login',
                //       method:'POST',
                //       //提交form表单的数据（data里的form所有加this）
                //       data:this.form
                //   }).then(res=>{
                //       console.log(res);
                //      //将获取的数据赋值给data
                //      const {data} =res;
                //      //通过commit调用store/user.js中mutations中的方法
                //      //然后将data（即请求回来的数据带到user.js）
                //      this.$store.commit('user/setUserInfo',data)
                //   })
                //注释掉上面的请求，将请求写到store/user.js的actions里
                //通过commit调用user.js中dispatch中的方法
                this.$store.dispatch('user/login',this.form).then(()=>{
                //登录成功提示
                this.$message.success('登录成功！！！');
                //跳转首页
                // this.$router.push('/')
                //使用push，路由会多存一条数据，使用replace则会代替当前路由
                //如果判断this.route.query.returnUrl有值返回之前页面，没有就返回首页
                this.$router.replace(this.$route.query.returnUrl || '/')

                })
              }
          })
          
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