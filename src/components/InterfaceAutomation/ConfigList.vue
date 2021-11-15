<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>接口自动化</el-breadcrumb-item>
          <el-breadcrumb-item>配置列表</el-breadcrumb-item>
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
                <el-button icon="el-icon-search" ></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="showConfigDialog" round size="small" style="margin-top: 5px;">新增配置</el-button>
          </el-col>
          <!--<el-col :span="3">-->
            <!--<el-button type="warning" round size="small" style="margin-top: 5px;">调试</el-button>-->
          <!--</el-col>-->

        </el-row>

        <el-table ref="configListTableRef" :data="configList" tooltip-effect="dark" border style="width: 100%" @selection-change="configSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="配置名称" prop="case_name"></el-table-column>
          <el-table-column label="所属项目" prop="belong_project"></el-table-column>
          <el-table-column label="所属模块" prop="belong_module"></el-table-column>
          <el-table-column label="创建人员" prop="author"></el-table-column>
          <el-table-column label="是否生效" prop="status"></el-table-column>
          <el-table-column label="创建日期" >  <!--prop="projectDate"-->
            <template #default="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="130">
            <template #default="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="调试运行" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-switch-button" circle size="mini" @click="debugCase(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--项目分页区域-->
        <el-pagination @size-change="confighandleSizeChange" @current-change="confighandleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>

      <!--添加配置对话框-->
      <el-dialog title="提示" :visible.sync="addConfigDialogVisible" width="60%" :before-close="addConfigDialogClose">
        <el-form :model="addConfigform" :rules="fromRules" ref="addConfigFormRef" label-width="80px" size="mini">
          <el-form-item label="配置名称" prop="case_name" >
            <el-input v-model="addConfigform.case_name"  ></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="belong_project" >
            <el-input v-model="addConfigform.belong_project" ></el-input>
          </el-form-item>
          <el-form-item label="所属模块" prop="belong_module" >
            <el-input v-model="addConfigform.belong_module" ></el-input>
          </el-form-item>
          <el-form-item label="创建者" prop="author" >
            <el-input v-model="addConfigform.author" ></el-input>
          </el-form-item>
          <!--<el-form-item label="请求类型" prop="reqMethod" >-->
            <!--<el-select v-model="addConfigform.reqMethod" placeholder="请选择请求类型" >-->
              <!--<el-option label="GET" value="get"></el-option>-->
              <!--<el-option label="POST" value="post"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="headers" prop="headers">
            <el-input v-model="addConfigform.headers"></el-input>
          </el-form-item>
          <el-form-item label="params" prop="params">
            <el-input v-model="addConfigform.params"></el-input>
          </el-form-item>
          <el-form-item label="data" prop="data" >
            <el-input v-model="addConfigform.data" ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addConfigDialogVisible = false" >取 消</el-button>
            <el-button type="primary" @click="addConfig" >确 定</el-button>
          </span>
        </template>
      </el-dialog>



   </div>
</template>

<script>
    export default {
        name: "ConfigList",
        data() {
            return {
                projectList: [
                    {
                        id: '1',
                        date: '2021-05-07',
                        projectName: '今晚打老虎',
                        projectOwner: '测试leader',
                        publishApp: 'production',
                        testUser: '测试tester',
                        projectNum: '3/2/5/2',
                        projectDate: '',
                    }, {
                        id: '2',
                        date: '2021-04-27',
                        projectName: '今晚打地鼠',
                        projectOwner: '测试leader',
                        publishApp: 'production',
                        testUser: '测试tester',
                        projectNum: '1/2/3/1',
                        projectDate: '',
                    },
                ],

                // 用例表格数据
                configList: [],

                // 选中的配置列表
                configListSelect: [],

                // select选中的项目名称
                selectProject: '',

                // 获取项目列表的参数
                queryInfo: {
                    query: '',
                    // 配置类型为 2
                    type:2,
                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 10,
                },
                total: 0,

                // 控制添加配置对话框显示隐藏
                addConfigDialogVisible: false,

                // 添加配置表单
                addConfigform: {
                    case_name: '',
                    belong_module: '',
                    belong_project: '',
                    author: '',
                    status: 1,
                    // reqMethod: '',
                    headers: '',
                    params: null,
                    data: null,
                    caseType:2,

                },

                // 编辑配置表单
                editConfigForm: {
                    id: '',
                    case_name: '',
                    belong_module: '',
                    belong_project: '',
                    author: '',
                    status: '',
                    reqMethod: '',
                    headers: '',
                    params: null,
                    data: null,
                    caseType:2,

                },

                // 表单验证
                fromRules: {
                    case_name: [
                        {required: true, message: '请输入用例名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    author: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    belong_project: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    belong_module: [
                        {required: true, message: '请输入模块名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 3, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    reqMethod: [
                        {required: true, message: '请选择情趣方式', trigger: 'change'}
                    ],
                    headers: [
                        {required: true, message: '请输入headers参数', trigger: 'blur'},
                    ],
                    params: [
                        {required: false, message: '请输入params参数', trigger: 'blur'},
                    ],
                    data: [
                        {required: false, message: '请输入data参数', trigger: 'blur'},
                    ],
                }
            }
        },
        created() {
            this.getConfigList()
        },
        methods:{

            // 获取用例列表
            getConfigList:async function () {
                console.log(this.queryInfo)
                console.log(this.selectProject)

                const {data:res} = await this.$http.get('auto_api/caselist',{params:this.queryInfo})
                if (res.code !== 200){
                    return this.$message.error('获取配置列表失败')
                }

                this.configList = res.data.caseList
                this.total = res.data.total
            },

            // 添加配置
            addConfig:async function() {
                this.$refs.addConfigFormRef.validate( async (valid) => {
                    console.log(valid)
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }

                    const {data:res} = await this.$http.post('auto_api/caselist',this.addConfigform)
                    if (res.code !== 200) {
                        return this.$message.error('添加配置失败')
                    }

                    this.$message.success('配置添加成功')
                    this.getConfigList()
                    this.addConfigDialogVisible = false
                    this.$refs.addConfigFormRef.resetFields()
                })

            },

            // 表格多选勾选值
            configSelectionChange:function (val) {
                this.configListSelect = val;
                console.log(val)
            },

            // 分页数量 切换触发
            confighandleSizeChange:function (newSize) {
                console.log('分页数量:',newSize)
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = 1
                this.getConfigList()
            },

            // 分页码值 改变触发
            confighandleCurrentChange:function (newPage) {
                console.log('分页码值:',newPage)
                this.queryInfo.pagenum = newPage
                this.getConfigList()
            },

            // 展示添加配置对话框
            showConfigDialog:function () {
                this.addConfigDialogVisible = true
            },
            // 监听添加配置对话框的关闭事件
            addConfigDialogClose:function (done) {
                this.$confirm('关闭后不会保存填写的数据！').then(_ => {
                    done();
                    this.$refs.addConfigFormRef.resetFields()
                })
            },
        }
    }
</script>

<style scoped>

</style>
