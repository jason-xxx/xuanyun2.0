//每当用户点击机票搜索按钮，就会将数据传到这里进行保存，就有了历史查询
export const state=()=>{
    return {
        //历史查询的数组
        history:[]
    }
}

export const mutations={
    //接收并把传入的表单数据存到history
    setHistory(state,data){
        //使用unshift方法将最新的搜索内容展示在头部
        state.history.unshift(data)
        //并通过截取数组长度控制搜索历史在5
        state.history.length=5;
    }
}