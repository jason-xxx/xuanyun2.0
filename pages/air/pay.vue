<template>
    <div class="container">
        <div class="main">
            <div class="pay-title">
                支付总金额 <span class="pay-price">￥{{orderDetail.price}}</span>
            </div>
            <div class="pay-main">
                <h4>微信支付</h4>
                <el-row type="flex" 
                justify="space-between" 
                align="middle"
                class="pay-qrcode">
                    <div class="qrcode">
                        <!-- 二维码 -->
                        <canvas id="qrcode-stage"></canvas>
                        <p>请使用微信扫一扫</p>
                        <p>扫描二维码支付</p>
                    </div>
                    <div class="pay-example">
                        <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt="">
                    </div>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
// 导入生成二维码的插件
//可以去GitHub搜索qrcode=>（这里使用的是星星第二多的文档）
import QRCode from 'qrcode'
export default {
    data(){
        return{
            //订单详情
            orderDetail:{},
            // 定时器
            timer: ""

        }
    },
    mounted(){
        //页面刷新后无法获取本地的token会报403的错误，需要使用定时器等待一下再执行
        setTimeout(() => {
            // 调用订单详情api接口
            this.$axios({
                //拼接id（orderForm.vue点击提交跳转时携带的id）
                url: "airorders/" + this.$route.query.id,
                //这个页面需携带token
                headers: {
                    Authorization: `Bearer ` + this.$store.state.user.userInfo.token
                }
            }).then(res => {
                // 将获取到的订单详情页赋值给orderDetail
                this.orderDetail=res.data;

                //获取二维码链接
                const {code_url}=this.orderDetail.payInfo;
                //使用DOM方法获取id
                const canvas=document.getElementById('qrcode-stage');
                // 生成二维码，渲染到id=qrcode-srage的标签上
                QRCode.toCanvas(canvas,code_url,{
                    width:200
                })
                //查询支付状态（3s查一次）
                this.timer=setInterval(()=>{
                    //调用methods:的isPay()
                    this.isPay();
                },3000)
            })
        }, 0)
    },
    //组件销毁时触发（让查询支付状态停止）
    destroyed(){
        // 停止定时器
        clearInterval(this.timer);
    },
    methods:{
        //是否支付成功函数
        isPay(){
            const {id,price,orderNo}=this.orderDetail
            this.$axios({
                url:'/airorders/checkpay',
                method:'POST',
                data:{
                    id,
                    nonce_str:price,
                    out_trade_no:orderNo
                },
                headers:{
                    Authorization: `Bearer ` + this.$store.state.user.userInfo.token
                    }
            }).then(res=>{
                //如果返回的是statusTxt='支付成功'就弹出提示，并停止定时器
                if(res.data.statusTxt==='支付完成'){
                    //停止定时器
                    clearInterval(this.timer);
                    //支付成功弹窗（element提供）
                    this.$alert('支付成功，微信收款100万元','提示',{
                        confirmButtonText:'确定',
                        type:'success'
                    })
                }
            })

        }
    }
}
</script>

<style scoped lang="less">
.container{
    background:#f5f5f5;
    padding: 30px 0;
    .main{
        width:1000px;
        margin:0 auto;
        .pay-title{
            text-align: right;
            span{
                font-size:28px;
                color:orangered;
            }
        }
        .pay-main{
            background:#fff;
            margin-top:10px;
            border-top: 5px orange solid;
            padding:30px;
            h4{
                font-size: 28px;
                font-weight: normal;
                margin-bottom: 10px;
            }
            .pay-qrcode{
                padding:0 80px;
            }
            .qrcode{
                border:1px #ddd solid;
                padding:15px;
                height: fit-content;
                #qrcode-stage{
                    width:200px;
                    height:200px;
                    margin-bottom: 10px;
                }
                p{
                    line-height: 2;
                    text-align: center;
                }
            }
        }
    }
}
</style>