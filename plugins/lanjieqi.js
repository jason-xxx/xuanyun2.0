//这是一个拦截错误的拦截器

//引入element中message的方法，需返回提示调用
import{Message}from 'element-ui'

//网页启动时就会执行plugins中的所有文件，包括这个lanjieqi.js
//就会返回data参数（里面有我们需要的对象如$axios)
export default (data)=>{
    // console.log(data);

    //拦截错误请求
    data.$axios.onError(err=>{
        // 将statusCode,message从data结构出来
        const{statusCode,message}=err.response.data;

        //判断状态如果是400，拦截并展示错误信息
        if(statusCode===400){
            //使用element-ui组件显示错误
            Message.error(message)
        }
    })
    
}