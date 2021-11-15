<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>接口自动化</el-breadcrumb-item>
          <el-breadcrumb-item>模块列表</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >

        <el-row :gutter="30">

          <el-col :span="10">
            <el-input placeholder="负责人名称" v-model="queryInfo.query" class="input-with-select">
              <template #prepend >
                <el-select v-model="selectModule" placeholder="模块名称" style="width:150px">
                  <el-option v-for="module in moduleList" :key="module.id" :label="module.moduletName" :value="module.id"></el-option>
                </el-select>
              </template>
              <template #append>
                <el-button icon="el-icon-search" @click="getModuleList"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" round size="small" style="margin-top: 5px;">新增模块</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="warning" round size="small" style="margin-top: 5px;" @click="debugMoreModules">调试模块</el-button>
          </el-col>

        </el-row>

        <el-table ref="ModuleListTableRef" :data="moduleList" tooltip-effect="dark" border style="width: 100%" @selection-change="SelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="模块名称" prop="module_name"></el-table-column>
          <el-table-column label="测试人员" prop="test_user"></el-table-column>
          <el-table-column label="所属项目" prop="belong_project_id"></el-table-column>
          <el-table-column label="用例/配置" prop="moduleNum"></el-table-column>
          <el-table-column label="创建日期" >  <!--prop="moduleDate"-->
            <template #default="scope">{{ scope.row.create_time }}</template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="130">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="调试运行" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-switch-button" circle size="mini" @click="debugModule(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--项目分页区域-->
        <el-pagination @size-change="modulehandleSizeChange" @current-change="modulehandleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>

      <!--调试模块用例对话框-->
      <el-dialog title="提示" :visible.sync="debugModuleDialogVisible" width="60%" :before-close="debugModuleDialogBeforClose" @close="debugModuleDialogClose">
        <el-form :model="debugModuleform" :rules="fromRules" ref="debugModuleFormRef" label-width="80px" size="mini">
          <el-form-item label="运行环境" prop="runChannel" >
            <el-select v-model="debugModuleform.runChannel" placeholder="请选择运行环境" >
              <el-option label="test" value="test"></el-option>
              <el-option label="prod" value="prod"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告名称" prop="report_name"  >
            <el-input v-model="debugModuleform.report_name"  :disabled="true" placeholder="默认开始时间+report命名：2021-06-18-18:16:43requort.html"></el-input>
          </el-form-item>
          <el-form-item label="运行方式" prop="runType" >
            <el-select v-model="debugModuleform.runType" placeholder="请选择运行方式" >
              <el-option label="同步(执行完立即返回报告)" value="sync"></el-option>
              <el-option label="异步(后台执行完毕后，报告列表查看)" value="async"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="debugModuleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="debugMoreModuleDialog">确 定</el-button>
          </span>
        </template>
      </el-dialog>
   </div>
</template>

<script>
    export default {
        name: "ModuleList",
        data() {
            return {
                // 项目列表
                moduleList: [],
                // 选中的项目列表
                moduleListSelect: [],

                // select选中的项目名称
                selectModule: '',
                // 获取项目列表的参数
                queryInfo: {
                    query: '',

                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 10,
                },
                total: 0,

                // 控制调试模块对话框显示隐藏
                debugModuleDialogVisible: false,

                // 调试模块对话框表单
                debugModuleform:{
                    runChannel:'',
                    belong_module:'',
                    report_name:'',
                    runType:'',
                },

                // 表单验证
                fromRules: {
                    report_name: [
                        { required: false, message: '请输入报告名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    belong_module:[
                        { required: true, message: '请输入模块名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    runChannel:[
                        { required: true, message: '请选择运行环境', trigger: 'change' }
                    ],
                    runType:[
                        { required: true, message: '请选择运行方式', trigger: 'change' }
                    ],
                },

                // ds

            };

        },
        created() {
            this.getModuleList()
        },
        methods:{
            getModuleList:async function () {
                console.log(this.queryInfo)
                console.log(this.selectModule)

                const {data:res} = await this.$http.get('auto_api/modulelist',{params:this.queryInfo})
                if (res.code !== 200){
                   return this.$message.success('获取项目列表失败')
                }
                this.moduleList = res.data.moduleList
                this.total = res.data.total
            },
            SelectionChange:function (val) {
                this.moduleListSelect = val;
                console.log(val)
            },

            // 分页数量 切换触发
            modulehandleSizeChange:function (newSize) {
                console.log('分页数量:',newSize)
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = 1
                this.getModuleList()
            },

            // 分页码值 改变触发
            modulehandleCurrentChange:function (newPage) {
                console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getModuleList()
            },

            // 监听添加调试模块对话框的关闭事件
            debugModuleDialogClose:function () {
                this.$refs.debugModuleFormRef.resetFields()
            },

            // 监听添加调试模块对话框的关闭之前事件
            debugModuleDialogBeforClose:function (done) {
                this.$confirm('关闭后不会保存填写的数据！').then(_ => {
                    done();
                    this.$refs.debugModuleFormRef.resetFields()
                })
            },

            // 运行模块下所有用例
            debugModule:async function (module_id) {
                console.log(module_id)

                var moduleListId = []
                moduleListId.push(module_id)
                const {data:res} =await this.$http.post('auto_api/runmodule',{moduleListId:moduleListId})
                if (res.code === 200) {
                    console.log(res.data)
                    location.href = 'http://0.0.0.0:8001/auto_api/case_report_html/' + res.data.fileName
                }
            },

            // 点击调试运行选中用例
            debugMoreModules:async function() {
                console.log(this.moduleListSelect)
                if (this.moduleListSelect.length !== 0) {

                    // 需要获取环境列表然后打开对话框


                    this.debugModuleDialogVisible = true
                    // 提交对话框数据并运行模块用例

                } else {
                    return this.$message.info("请至少选择一个用例运行")
                }
            },

            // 调试运行对话框确认操作
            debugMoreModuleDialog:async function () {
                this.$refs.debugModuleFormRef.validate( async (valid) => {
                    console.log("判断表单是否验证通过：",valid)
                    console.log("Dialog提交表单数据：",this.debugModuleform)
                     if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }

                    const {data: res} = await this.$http.post('auto_api/runmodule', {moduleListId: this.moduleListSelect})
                    if (res.code !== 200) {
                        this.debugModuleDialogVisible = false
                        return this.$message.error('添加用例失败')
                    }

                    this.debugModuleDialogVisible = false
                    this.getModuleList()
                    if (this.debugModuleform.runType === 'sync') {
                        console.log(res.data)
                        location.href = 'http://0.0.0.0:8001/auto_api/case_report_html/' + res.data.fileName
                    } else {
                        return this.$message.success("模块用例正在运行,稍候在报告列表查看")
                    }
                    this.$refs.debugModuleFormRef.resetFields()

                })
            },
        }
    }
</script>

<style scoped>

</style>
