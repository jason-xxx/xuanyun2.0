<template>
    <div class="filters">
        <el-row type="flex" class="filters-top" justify="space-between" align="middle">
            <el-col :span="8">
                单程： 
                {{data.info.departCity}}- {{data.info.destCity}} 
                / 
                {{data.info.departDate}}
            </el-col>
            <el-col :span="4">
                <!-- 机场列表 -->
                <el-select size="mini" 
                v-model="airport" 
                placeholder="起飞机场" 
                @change="handleAirport">
                <!-- 筛选起飞机场 -->
                    <el-option
                    v-for="(item,index) in data.options.airport"
                    :key="index"
                    :label="item"
                    :value="item"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <!-- 起飞时间列表 -->
                <el-select size="mini" v-model="flightTimes"  placeholder="起飞时间" @change="handleFlightTimes">
                    <el-option
                    v-for="(item,index) in data.options.flightTimes"
                    :key="index"
                    :label="`${item.from}:00-${item.to}:00`"
                    :value="`${item.from},${item.to}`">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <!-- 航空公司 -->
                <el-select size="mini" v-model="company"  placeholder="航空公司" @change="handleCompany">
                    <el-option
                    v-for="(item,index) in data.options.company"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <!-- 机型列表 -->
                <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
                    <el-option
                    v-for="(item,index) in airSizeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <div class="filter-cancel">
            筛选：
            <el-button 
                       type="primary" 
                       round 
                       plain 
                       size="mini" 
                       @click="handleFiltersCancel">
                撤销
    		</el-button>
        </div>
        <!-- 渲染空的字符串，只需要监听功能 -->
        <span>{{filter}}</span>
    </div>
</template>

<script>
export default {
    data(){
        return {
            airport: "",        // 机场
            flightTimes: "",    // 出发时间
            company: "",        // 航空公司
            airSize: "",        // 机型大小
            airSizeList:[
                {label:'大',value:'L'},
                {label:'中',value:'M'},
                {label:'小',value:'S'}
            ]
        }
    },
     props: {
        // 组件可以接收的属性
        data: {
            type: Object,
            default: {}
        }
    },
    //computed用来同时监听多个属性，watch只能监听一个
    computed:{
        // 渲染空的字符串，只需要监听功能
        filter(){
            const newData = this.data.flights.filter(v => {
                // 假设当前的数据都是符合条件，
                let valid = true;
                // 找到不符合条件的（使用了类似排他的方法取反！）
                if(this.company && v.airline_name !== this.company){
                    valid = false;
                }
                // 机型大小
                // 找到不符合条件的（使用了类似排他的方法取反！）
                if(this.airSize && v.plane_size !== this.airSize){
                    valid = false;
                }
                // 机场
                // 找到不符合条件的（使用了类似排他的方法取反！）
                if(this.airport && v.org_airport_name !== this.airport){
                    valid = false;
                }
                // 时间
                //找到不符合条件的（使用了类似排他的方法取反！）
                if(this.flightTimes){
                    // 选中的时间段
                    const arr = this.flightTimes.split(","); // ["6","12"]
                    // 当前航班小时
                    const hours = Number(v.dep_time.split(":")[0]);
                    
                    // 如果出发的小时不在时间段内，认为是不合法
                    if(Number(arr[0]) > hours || hours >= Number(arr[1])){
                        valid = false;
                    }
                }
                return valid;
            })
            this.$emit("getData", newData);
            return "";
        }  
    },
    methods: {
        // 选择出发机场时候触发
        handleAirport(value){
        //  //从所有出发机场里找到符合value的
        //  const newData=this.data.flights.filter(v=>{
        //      //如果return的值为true，说明符合条件
        //      return v.org_airport_name===value;
        //  })
        //  this.$emit('getData',newData)
            
        },
        // 选择出发时间时候触发
        handleFlightTimes(value){
            // const arr=value.split(',');

            // const newData=this.data.flights.filter(v=>{
            // //出发时间小时
            // const hours=Number(v.dep_time.split(':')[0]);
            // //如果return的值为true，说明符合条件（出发的小时是否在选中范围内）
            // return Number(arr[0]<=hours&& hours<Number(arr[1]))
            // })
            // this.$emit('getData',newData)
        },
         // 选择航空公司时候触发
        handleCompany(value){
        //   // 从所有航班里面找到条件符合value的(filter是循环的一种方法)
        //   //例如点击东航，从多的数组中找到与东航相关的数组
        //   //过滤类似关键字匹配数组，value（展开中的其中一项）就是关键字
        //   //newData就是通过过滤出来的数组
        //   const newData=this.data.flights.filter(v=>{
        //       //如果return的值是true（）,说明复合条件
        //       return v.airline_name===value
        //   })  
        //   //子传父，通过getData把数据改变成过滤后的数据
        //   this.$emit('getData',newData)
        },
         // 选择机型时候触发
        handleAirSize(value){
        //   //从所有航班里面找到条件符合value的(filter是循环的一种方法)。。。
        //   const newData=this.data.flights.filter(v=>{
        //       //如果return为true，说明复合条件
        //       return v.plane_size===value;
        //   })
        //   this.$emit('getData',newData)
           
        },
        
        // 撤销条件时候触发
        handleFiltersCancel(){
            
        },
    }
}
</script>

<style scoped lang="less">
    .filters{
        margin-bottom:20px;
    }
    .filters-top{
        > div{
            /deep/ .el-select{
                margin-left:10px;
            }
        }
    }
    .filter-cancel{
        margin-top:10px;
    }
</style> 