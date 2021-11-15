<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>接口自动化</el-breadcrumb-item>
          <el-breadcrumb-item>项目列表</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >

        <el-row :gutter="30">

          <el-col :span="10">
            <el-input placeholder="负责人名称" v-model="queryInfo.query" class="input-with-select">
              <template #prepend >
                <el-select v-model="selectProject" placeholder="项目名称" style="width:150px">
                  <el-option v-for="project in projectList" :key="project.id" :label="project.projectName" :value="project.id"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button icon="el-icon-search" @click="getProjectList"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" round size="small" style="margin-top: 5px;">新增项目</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="warning" round size="small" style="margin-top: 5px;">调试项目</el-button>
          </el-col>

        </el-row>

        <el-table ref="ProjectListTableRef" :data="projectList" tooltip-effect="dark" border style="width: 100%" @selection-change="SelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="项目名称" prop="project_name"></el-table-column>
          <el-table-column label="负责人" prop="responsible_name"></el-table-column>
          <el-table-column label="发布应用" prop="publish_app"></el-table-column>
          <el-table-column label="测试人员" prop="test_user"></el-table-column>
          <el-table-column label="模块/Suite/用例/配置" prop="projectNum"></el-table-column>
          <el-table-column label="创建日期" >  <!--prop="projectDate"-->
            <template #default="scope">{{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="130">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="调试运行" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-switch-button" circle size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--项目分页区域-->
        <el-pagination @size-change="projecthandleSizeChange" @current-change="projecthandleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>
   </div>
</template>

<script>
    export default {
        name: "ProjectList",
        data() {
            return {
                // 项目列表
                projectList: [],
                // 选中的项目列表
                projectListSelect: [],

                // select选中的项目名称
                selectProject: '',
                // 获取项目列表的参数
                queryInfo: {
                    query: '',

                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 10,
                },
                total: 0,
            };

        },
        created() {
            this.getProjectList()
        },
        methods:{
            getProjectList:async function () {
                console.log(this.queryInfo)
                console.log(this.selectProject)

                const {data:res} = await this.$http.get('auto_api/projectlist')
                if (res.code !== 200){
                   return this.$message.success('获取项目列表失败')
                }
                this.projectList = res.data.projectList
                this.total = res.data.total
            },
            SelectionChange:function (val) {
                this.projectListSelect = val;
                console.log(val)
            },

            // 分页数量 切换触发
            projecthandleSizeChange:function (newSize) {
                console.log('分页数量:',newSize)
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = 1
                this.getProjectList()
            },

            // 分页码值 改变触发
            projecthandleCurrentChange:function (newPage) {
                console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getProjectList()
            },
        }
    }
</script>

<style scoped>

</style>
