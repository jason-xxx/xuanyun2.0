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
  }

}