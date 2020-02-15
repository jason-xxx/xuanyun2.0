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
        state.history.push(data)
    }
}