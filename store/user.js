//因为是使用const定义的固定属性，必须要export暴露
export const state=()=>{
  return{
        userInfo:{
            user:{}
        }
  }
}

//mutations是固定属性，修改state中的值
export const mutations={
  //setUserInfo是自己命名定义的函数
  //第一个参数必须是state，第二个是调用时传入的参数
  setUserInfo(state,data){
    //将在loginForm.vue获取的data，赋值给上面的userInfo
    state.userInfo=data;
    }
}

// actions是固定的属性，异步修改state中的值的方法，一般存放接口的请求
export const actions={
  //登录方法————————————————————————————————————————————————————————
  //login是自定义的函数
  //第一个参数必须是store，第二个是调用时传入的参数
  login(store,data){
      //必须要return提交到登录接口
      return this.$axios({
        url: "/accounts/login",
            method: "POST",
            data
      }).then(res=>{
        // 将获取的数据赋值给data
        const{data}=res;
        //调用commit保存数据到setUserInfo再传到state
        store.commit('setUserInfo',data)
      })
  },
  //注册方法——————————————————————————————————————————————————
  register(store,suibian){
    //调用注册接口
    return this.$axios({
      url:'/accounts/register',
      method:'POST',
      data:suibian
    }).then(res=>{
      //data是要保存到userInfo里的
      const{data}=res;
      //调用commit保存数据到state(通过mutations中的setUserInfo)
      store.commit('setUserInfo',data)
    })
  },
  //获取验证码方法————————————————————————————————————————————
  //通过sendCaptcha自定义函数发验证请求
  sendCaptcha(store,data){
    return this.$axios({
      url:'captchas',
      method:'POST',
      data:{
        tel:data
      }
    }).then(res => {
      console.log("store中的：", res);
      return res;
  })
  }

}