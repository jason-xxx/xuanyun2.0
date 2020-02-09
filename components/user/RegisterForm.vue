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
    //验证手机号码
    const validateUsername=(rules,value,callback)=>{
        if(value===''){
            callback(new Error('请输入手机号码'))
        }else if(/^1[3-9][0-9]{9}$/.test(value)==false){
            callback(new Error('请输入正确的手机格式'))
        }else{
            callback();
        }
    }
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
           {validator:validateUsername,trigger:'blur'}
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
          //判断手机号不能为空
          if(this.form.username==''){
              return;
          }
          //调用store仓库user模块下的发送验证请求
          this.$store.dispatch('user/sendCaptcha',this.form.username).then(res=>{
              this.$message.success('模拟手机验证码：000000')
          })
      },
      // 注册
      handleRegSubmit(){
          this.$refs.form.validate(valid=>{
              //表单验证全部通过
              if(valid){
              //是用结构的方法将checkPassword移除，因为axios不需要接收这个值
              //suibian就是移除checkPassword后的对象，含义请求需要的4个值（具体看api）；
              const{checkPassword,...suibian}=this.form;

              //调用axios注册接口
              this.$axios({
                  url:'/accounts/register',
                  method:'POST',
                  //suibian就是移除checkPasword的form
                  data:suibian
              }).then(res=>{
                  const{data}=res;
                  //调用commit保存数据到user.js中state将data数据赋值给userInfo
                  this.$store.commit('user/setUserInfo',data)
                  //提示注册成功提示框
                  this.$message.success('注册成功');
                  //跳转主页
                  this.$router.push('/')
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