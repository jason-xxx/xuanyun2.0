<template>
    <section class="contianer">
        <el-row  type="flex" justify="space-between">

            <!-- 顶部过滤列表 -->
            <div class="flights-content">
                <!-- 过滤条件 -->
               <FlightsFilters :data='cacheFlightsData' @getData='getData'/>

                <!-- 航班头部布局 -->
                <FlightsListHead/>

                <!-- 航班信息 -->
                <FlightsItem
                v-for="(item,index) in dataList"
                :key="index"
                :data="item"/>

            <!-- 分页组件 -->
            <!-- size-change: 切换条数时候触发的事件
            current-change: 切换页面时候触发的事件
            current-page: 当前的页数
            page-size: 当前的条数
            total: 总条数 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
            </div>

            <!-- 侧边栏 -->
            <FlightsAside/>
        </el-row>
    </section>
</template>

<script>
// 导入组件
import FlightsListHead from "@/components/air/flightsListHead"
import FlightsItem from "@/components/air/flightsItem"
import FlightsFilters from '@/components/air/flightsFilters'
import FlightsAside from '@/components/air/flightsAside'
export default {
    data(){
        return {
          //是机票的总数据（含info，flight，total，options这些属性）
            flightsData:{
                info: {},
                flights: [],
                options: {},
            },
            //数据备份，
            cacheFlightsData:{
                info:{},
                flights: [],
                options:{}
            },
            //当前页面
            pageIndex:1,
            //当前的条数
            pageSize:5,
            //总条数
            total:0
        }
    },computed: {
        // 切割之后返回的数组（当前页面要展示的数组）
        // 计算属性函数内部引用实例（this）的属性一旦发生了变化，函数会重新执行返回新的值
        dataList(){
            // 判断flightsData有没有值
            if(!this.flightsData.flights){
                // 没有值返回一个空数组
                return [];
            }
            // 第一页是0-5，第二页是5-10，第三页是10-15
            const arr = this.flightsData.flights.slice(
                (this.pageIndex - 1) * this.pageSize, 
                this.pageIndex * this.pageSize
            );
            return arr;
        }	        
        },
    components: {
        FlightsListHead,
        FlightsItem,
        FlightsFilters,
        FlightsAside
    },
    // watch可以监听实例下任何属性的变化
    watch: {
        $route(){
            // 每次url变化时候把pageIndex初始化为1
            this.pageIndex = 1;
            // 请求机票列表数据
            this.getList();
        }
    },
    mounted(){
        //-----------将下面函数进行封装-------在methods:
    //   this.$axios({
    //     url:'/airs',
    //     //从http地址上拿那个五个参数:城市x2、城市代码x2、时间
    //     params:this.$route.query
    //   }).then(res=>{
    //     // 将返回数据赋值给flightsDdta
    //     this.flightsData=res.data;
    //      //备份数据，使用{...}方法展开对象，从而得到新的对象才不与上面的flightsData冲突
    //      //每次备份都会从新在这里拿数据
    //      this.cacheFlightsData={...res.data}
        
    //     //修改总条数
    //     this.total = this.flightsData.total;             
    //   })

    //调用封装函数getList()
      this.getList();
    }, 
    methods: {
         // 请求机票列表接口下面为封装好的函数
        getList(){
            // 请求机票列表数据
            this.$axios({
                url: "/airs",
                params: this.$route.query
            }).then(res => {
                // 总数据
                this.flightsData = res.data;
                // 备份一下数据, 注意res.data需要拷贝一份出来
                this.cacheFlightsData = {...res.data};
                
                // 修改总条数
                this.total = this.flightsData.total;  
            })
        },
     // 切换条数时候触发的事件
     handleSizeChange(index){
         this.pageSize = index;
     },
     // 切换页数时候触发的事件
     handleCurrentChange(index){
         this.pageIndex = index;
     },

     //获取过滤组件的过滤后的数组（arr就是过滤后的数组newData）
     getData(arr){
        //  这样就将原来的数据更改为过滤的数据了
        // （因为改了数据，点击其他航空公司时就没了，存在bug，稍后修复）
         this.flightsData.flights=arr;
         //数据变少，页码也需要变少
         this.total=arr.length;
     }
    }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }
    .flights-content{
        width:745px;
        font-size:14px;
    }
    .aside{
        width:240px;
    } 
</style>