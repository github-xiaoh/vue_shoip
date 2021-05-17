<template>
   <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>测试管理</el-breadcrumb-item>
          <el-breadcrumb-item>充值影点</el-breadcrumb-item>
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
        name: "Recharge"
    }
</script>

<style scoped>

</style>
