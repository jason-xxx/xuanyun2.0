<template>
  <!-- model：指定表单的数据对象 -->
  <!-- ref: 用于获取dom对象 -->
  <!-- rules: 表单验证规则 -->
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
        <!-- 新添双向绑定v-model，才能输入内容 -->
        <el-input
        v-model="form.username"
        placeholder="用户名手机">
        </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
        <el-input
        v-model="form.captcha" 
        placeholder="验证码" >
            <template slot="append">
                <el-button @click="handleSendCaptcha">
                    发送验证码
                </el-button>
            </template>
        </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
        <el-input
        v-model="form.nickname" 
        placeholder="昵称">
        </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password"> 
        <el-input
        v-model="form.password" 
        placeholder="密码" 
        type="password"
        ></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
        <el-input
        v-model="form.checkPassword" 
        placeholder="确认密码" 
        type="password">
        </el-input>
    </el-form-item>

    <el-button 
    class="submit" 
    type="primary" 
    @click="handleRegSubmit">
                注册
            </el-button>
        </el-form>
</template>

<script>
export default {
  data(){
    // 密码的验证规则函数(element官网提供form组件里)
    //rule当前规则（可忽略） 
    //value输入框的值
    //callback是必须要执行，必须有，如果传入错误对象，当前的输入框下就会报错
    const validatePass=(rule,value,callback)=>{
        if(value===''){
            callback(new Error('请输入密码'));
        }else{
            if(this.form.checkPassword !==''){
              //验证和确认密码是否一致，手动触发确认密码验证
              this.$refs.form.validateField('checkPassword')
            }
            callback();
        }
    }
    //验证确认密码(element官网提供form组件里)
      const validateCheckPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
    return {
        // 表单数据
      form: {
          username:"",
          captcha:"",
          nickname:"",
          password:"",
          checkPassword:""
      },
      // 表单规则
      rules: {
          username:[
           //required表示必填，message:为错误信息，trigger失焦时触发
           {required: true,message:"请输入用户名",trigger:'blur'}
           ],
          captcha:[
            {required:true,message:'请输入验证码',trigger:"blur"}
          ],
          nickname:[
            {required:true,message:'请输入昵称',trigger:'blur'}
          ],
          password:[
            //validator是验证函数，失焦时会执行，这个函数需写在return前！！
            {validator:validatePass,trigger:'blur'}
          ],
          checkPassword:[
            {validator:validateCheckPass,trigger:'blur'}
          ]
      },
    }
  },

  methods: {
      // 发送验证码
      handleSendCaptcha(){
      },
      // 注册
      handleRegSubmit(){
          this.$refs.form.validate(valid=>{
              //表单验证全部通过
              if(valid){
                //准备调用注册接口
                console.log(this.form)
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