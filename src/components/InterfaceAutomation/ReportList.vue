<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>接口自动化</el-breadcrumb-item>
          <el-breadcrumb-item>报告列表</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <!--卡片内容区域-->
      <el-card class="box-card" >

        <el-row :gutter="30">

          <el-col :span="10">
            <el-input placeholder="负责人名称" v-model="queryInfo.query" class="input-with-select">
              <template #prepend >
                <el-select v-model="selectReport" placeholder="报告名称" style="width:150px">
                  <el-option v-for="report in reportList" :key="report.id" :label="report.reportName" :value="report.id"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button icon="el-icon-search" @click="getReportList"></el-button>
              </template>
            </el-input>
          </el-col>

        </el-row>

        <el-table ref="reportListTableRef" :data="reportList" tooltip-effect="dark" border style="width: 100%" @selection-change="SelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="报告名称" prop="report_name">
            <template slot-scope="scope" >
              <el-link :href="'http://0.0.0.0:8001/auto_api/case_report_html/'+scope.row.id" type="primary" style="font-size: 12px;">{{scope.row.report_name}}</el-link>
              <!--#/reporttemplate-->
            </template>
          </el-table-column>
          <el-table-column label="开始日期" >  <!--prop="reportDate"-->
            <template #default="scope">{{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column label="测试结果" prop="status"></el-table-column>
          <el-table-column label="总计用例" prop="caseTotal"></el-table-column>
          <!--<el-table-column label="成功用例" prop="caseSuccess"></el-table-column>-->

          <el-table-column prop="" label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="下载" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-download" circle size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--项目分页区域-->
        <el-pagination @size-change="reporthandleSizeChange" @current-change="reporthandleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>
   </div>
</template>

<script>
    export default {
        name: "ReportList",
        data() {
            return {
                reportList: [],
                // 选中的项目列表
                reportListSelect: [],

                // select选中的项目名称
                selectReport: '',
                // 获取项目列表的参数
                queryInfo: {
                    query: '',

                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 10,
                },
                // 分页展示数量
                total: 0,
            };

        },
        created() {
            this.getReportList()
            // location.href = 'http://0.0.0.0:8001/auto_api/case_report_html'
        },
        methods:{
            getReportList:async function () {
                console.log(this.queryInfo)
                console.log(this.selectReport)

                const {data:res} = await this.$http.get('auto_api/reportList',{params:this.queryInfo})
                if (res.code !== 200){
                    return this.$message.error('获取报告列表失败')
                }
                this.reportList = res.data.reportList
                this.total = res.data.total
            },
            // 表格勾选多选框时触发
            SelectionChange:function (val) {
                this.reportListSelect = val;
                console.log(val)
            },
            // 分页数量 切换触发
            reporthandleSizeChange:function (newSize) {
                console.log('分页数量:',newSize)
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = 1
                this.getReportList()
            },

            // 分页码值 改变触发
            reporthandleCurrentChange:function (newPage) {
                console.log('分页码值',newPage)
                this.queryInfo.pagenum = newPage
                this.getReportList()
            },
        }
    }
</script>

<style scoped>

</style>
