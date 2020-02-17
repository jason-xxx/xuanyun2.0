<template>
    <div class="main">
        <div class="air-column">
            <h2>乘机人</h2>
            <el-form class="member-info">
                <div class="member-info-item" 
                v-for="(item,index) in form.users"
                :key="index">

                    <el-form-item label="乘机人类型">
                        <el-input placeholder="姓名" 
                        class="input-with-select"
                        v-model="item.username">
                            <el-select 
                            slot="prepend" 
                            value="1" 
                            placeholder="请选择">
                                <el-option label="成人" value="1"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="证件类型">
                        <el-input 
                        placeholder="证件号码"  
                        class="input-with-select"
                        v-model="item.id">
                            <el-select 
                            slot="prepend" 
                            value="1"           
                            placeholder="请选择">
                                <el-option label="身份证" value="1" :checked="true"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <span class="delete-user" @click="handleDeleteUser(index)">-</span>
                </div>
            </el-form>

            <el-button class="add-member" type='primary' @click="handleAddUsers">添加乘机人</el-button>
        </div>

        <div class="air-column">
            <h2>保险</h2>
            <div>
                <!-- 循环渲染保险数据 -->
                <div class="insurance-item" 
                v-for="(item, index) in infoData.insurances"
                :key="index">
                    <el-checkbox 
                    :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"  
                    border
                     @change="handleInsurance(item.id)">
                    </el-checkbox> 
                </div>
            </div>
        </div>

        <div class="air-column">
            <h2>联系人</h2>
            <div class="contact">
                <el-form label-width="60px">
                    <el-form-item label="姓名">
                        <el-input v-model="form.contactName"></el-input>
                    </el-form-item>

                    <el-form-item label="手机">
                        <el-input placeholder="请输入内容"
                        v-model="form.contactPhone">
                            <template slot="append">
                            <el-button @click="handleSendCaptcha">发送验证码</el-button>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="验证码">
                        <el-input v-model="form.captcha"></el-input>
                    </el-form-item>
                </el-form>   
                <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
            </div>
        </div>
        <!-- 需要渲染allPrice（）函数才能执行 -->
        <span>{{allPrice}}</span>
    </div>
</template>

<script>
export default {
    data(){
        return{
           form:{
                //乘机人的列表（使用数组是可添加多个乘机人）
            users:[
                {
                    username:"",//名字
                    id:""//身份证
                }
            ],
            insurances:[],//保险id(保险需后台获取)
            contactName:'',//联系人名字
            contactPhone:'',//联系人电话
            captcha:'',//文档中缺少属性（文档写错了）
            invoice:false,//因为此案例不需要发票，直接false
            seat_xid:this.$route.query.seat_xid,//直接在http里拿，因为上面有挂载
            air:this.$route.query.id//同理，直接在http里拿，因为上面有挂载
           },
          //当前的机票详情信息,已关联到axios的数据
          infoData:{}
        }
    },
    //监听多个
    computed:{
        //总价格，展示在侧边栏组件
        allPrice(){
            //先判断infoData是否有数据（即是否请求成功），否则会报错，因为请求延时
            if(!this.infoData.seat_infos){
                return;
            }
        //先定义一个变量，然后在后面累加
          let price=0;
        //   机票单价：
        price+=this.infoData.seat_infos.org_settle_price;
        //基础燃油费
        price+=this.infoData.airport_tax_audlet;
        //保险
        this.infoData.insurances.forEach(v=>{
            //如果保险id数组中有保险id就需加上保险费
            if(this.form.insurances.indexOf(v.id) > -1){
                price+=v.price;
            }
        });
        //添加人数时
        price*=this.form.users.length;
        //把总价保存到store中
        this.$store.commit('air/setAllPrice',price)
        return '';
        }

    },
    mounted(){
        //请求机票详情信息（里面包含保险和右侧栏需要的信息）
        const {id, seat_xid} = this.$route.query;//需要结构
        this.$axios({
            //因为api给到的url是'/airs/:id'是带 : 的，所有要以下面的形式写
          url: "/airs/" + id,
          //get请求用params，post用data
          params:{
              seat_xid
          }
        }).then(res=>{
            //赋值给infoData（当前的机票详情信息）
           this.infoData=res.data
        // console.log(res.data);

        //将infoData保存到store中
        this.$store.commit('air/setOrderDetail',this.infoData)        
        })
    },
    methods: {
        // 添加乘机人
        handleAddUsers(){
        //点击添加乘机人时，push一个数组进去
        this.form.users.push({
                    username:"",//名字
                    id:""//身份证
        })           
        },  
        // 处理保险数据的
        handleInsurance(id){
            // 先判断数组中是否存在该id
            const index = this.form.insurances.indexOf(id);
            // 如果已经有了这个id，说明当前是取消的状态
            if(index > -1){
                // 删除该id
                this.form.insurances.splice(index, 1);
            }else{
                // 没有id就是新增
                this.form.insurances.push(id);
            }
        },
        
        // 移除乘机人
        handleDeleteUser(index){
        // 使用splice方法删数组(index：表示删哪一项，1：表示删多少个)
            this.form.users.splice(index,1)
        },
        
        // 发送手机验证码
        handleSendCaptcha(){
            if(!this.form.contactPhone){
                this.$message.error('手机号码不能为空')
                return;
            }
            //调用store/user.js中发送验证码方法
            this.$store.dispatch(
                'user/sendCaptcha',
                this.form.contactPhone
            ).then(res=>{
            this.$message.success('验证发送成功：000000')
        })
        },
        // 提交订单
        handleSubmit(){
            //表单的自定义验证
           const rules = {
                users: {
                    errMessage: "乘机人信息不能为空",
                    // 校验的函数,该函数返回是true的证明验证通过，如果是false就验证失败
                    validator: () => {
                        let valid = true;
                        //使用formEach循环users这个数组，拿到users和id继续非空判断
                        this.form.users.forEach(v => {
                            // 只要users和id有一个属性的值是空的话表单没通过，就弹出错误提示
                            if(!v.username || !v.id){
                                valid = false;
                            }
                        });
                        return valid;
                    }
                },
                // 校验联系人
                contactName: {
                    errMessage: "联系人不能为空",
                    validator: () => {
                    //!!是判断字符串的布尔类型，内容为空就false，不为空则true
                        return !!this.form.contactName;
                    }
                },
                // 校验手机号码
                contactPhone: {
                    errMessage: "手机号码不能为空",
                    validator: () => {
                    //!!是判断字符串的布尔类型方法，内容为空false，不为空则true
                        return !!this.form.contactPhone;
                    }
                },
                // 校验验证码
                captcha: {
                    errMessage: "验证码不能为空",
                    validator: () => {
                    //!!是判断字符串的布尔类型方法，内容为空false，不为空则true
                        return !!this.form.captcha;
                    }
                }
            }
            // 循环上面整个rules对象调用validator方法实现校验
            // console.log(Object.keys(rules))
            // 先假设所有校验都是通过的
            let  valid = true;
            // Object.keys方法可以返回以对象的'键'组成的数组
            Object.keys(rules).forEach(v => {
                // 如果已经有字段校验不通过，就不用继续判断了
                if(!valid) return;
                const item = rules[v];
                // 执行每个字段下的validator函数，即判断非空
                valid = item.validator();
                
                if(!valid){
                    this.$message.error(item.errMessage);
                }
            })
            // 如果验证没通过，就直接返回
            if(!valid) return;
            // 调用提交订单的接口
            // console.log(this.form.insurances)
             // 调用提交订单的接口
           this.$axios({
                url: "/airorders",
                method: "POST",
                data: this.form,
                headers: {
                    // 必须要做token前面加上`Bearer `字符串，后面有一个空格的
                    //黑马头条token前没加`Bearer `是因为在后台加了，是一种固定写法
                    Authorization: `Bearer ` + this.$store.state.user.userInfo.token
                }
            }).then(res => {
                //根据res的返回值判断订单是否提交成功
                // console.log(res);
                // 添加提交成功提示
                this.$message.success('订单提交成功')

                //跳转付款页面(通过setTimeout延时跳转，加强用户体验)
                setTimeout(()=>{
                this.$router.push({
                    path:'/air/pay',
                    query:{
                        id:res.data.data.id//订单id
                    }
                })
                },2000)
            })
            
        }
    }
}
</script>

<style scoped lang="less">
    .air-column{
        border-bottom:1px #ddd dashed;
        padding-bottom: 20px;   
        margin-bottom: 20px;
    }
    .air-column h2{
        margin-bottom: 20px;
        font-size: 22px;
        font-weight: normal;
    }
    /deep/ .el-select .el-input {
        width: 130px;
    }
    .input-with-select{
        width:590px;
    }
    .input-with-select /deep/  .el-input-group__prepend {
        background-color: #fff;
    }
    .member-info /deep/ .el-form-item{
        margin-bottom:0;
    }
    .member-info-item{
        border-bottom:1px #eee dashed;
        padding-bottom: 20px;
        position: relative;
        &:first-child{
            .delete-user{
                display: none;
            }
        }
    }
    .add-member{
        margin-top:20px;
    }
    .delete-user{
        display: block;
        background:#ddd;
        width:16px;
        height:16px;
        font-size:14px;
        text-align: center;
        line-height: 16px;
        color:#fff;
        cursor: pointer;
        border-radius: 50px;
        position:absolute;
        right:-30px;
        top:50%;
    }
    .insurance{
        > div{
            margin-top:10px;
        }
    }
    .insurance-item{
        margin-bottom: 20px;
    }
    .contact{
        /deep/ .el-input{
            width:50%;
        }
    }
    .submit{
        margin: 50px auto;
        display: block;
        width:250px;
        height:50px;
    }
    </style>