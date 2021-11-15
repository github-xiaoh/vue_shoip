<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>接口自动化</el-breadcrumb-item>
          <el-breadcrumb-item>定时任务</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >
        <h3>敬请期待</h3>
      </el-card>
   </div>
</template>

<script>
    export default {
        name: "PeriodicTask",
        data() {
            return{

            }
        },
        created(){
            // this.getTask1();
        },
        methods:{
            getTask1:async function () {
                const {data:res} = await this.$http.get('auto_api/gettask1')
                const {data:res2} = await this.$http.get('auto_api/gettask2')
            }
        },
    }
</script>

<style scoped>

</style>
