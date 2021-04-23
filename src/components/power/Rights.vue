<template>
  <div>
    <!--面包屑区域-->
    <template>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <!--卡片内容区域-->
    <el-card class="box-card" >

      <!--表格列表区域-->
      <el-table :data="rightsList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column prop="level" label="等级" >
          <template slot-scope="scope">
            <el-tag v-if=" scope.row.level === '0' " size="mini" >一级</el-tag>
            <el-tag v-else-if=" scope.row.level === '1' " size="mini" type="success" >二级</el-tag>
            <el-tag v-else=" scope.row.level === '2' " size="mini" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "Rights",
        data() {
            return {
                // 权限列表
                rightsList:[],
            }
        },
        created() {
            this.getRightsList()
        },
        methods: {
            getRightsList: async function(){
                const {data:res} = await this.$http.get('rights/list')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限列表失败')
                }

                this.rightsList = res.data
                console.log(this.rightsList)
            }
        }
    }
</script>

<style scoped>

</style>
