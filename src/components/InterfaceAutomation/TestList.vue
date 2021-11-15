<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>接口自动化</el-breadcrumb-item>
          <el-breadcrumb-item>用例列表</el-breadcrumb-item>
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
                <el-button icon="el-icon-search" @click="getCaseList"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="showDialog" round size="small" style="margin-top: 5px;" >新增用例</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="warning" round size="small" style="margin-top: 5px;" @click="debugMoreCase">调试用例</el-button>
          </el-col>

        </el-row>

        <el-table ref="caseListTableRef" :data="caseList" tooltip-effect="dark" border style="width: 100%" @selection-change="caseSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="用例名称" prop="case_name"></el-table-column>
          <el-table-column label="所属项目" prop="belong_project"></el-table-column>
          <el-table-column label="所属模块" prop="belong_module"></el-table-column>
          <el-table-column label="创建人员" prop="author"></el-table-column>
          <el-table-column label="是否生效" prop="status"></el-table-column>
          <el-table-column label="创建日期" >  <!--prop="projectDate"-->
            <template #default="scope">{{ scope.row.case_name }}</template>
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
        <el-pagination @size-change="casehandleSizeChange" @current-change="casehandleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>

      <!--添加用例对话框-->
      <el-dialog title="添加用例信息" :visible.sync="addCaseDialogVisible" width="60%" :before-close="addCaseDialogBeforeClose" @close="addCaseDialogClose">
        <el-form :model="addCaseform" :rules="fromRules" ref="addCaseFormRef" label-width="80px" size="mini">
          <el-tabs type="border-card">
            <el-tab-pane label="message">
              <el-form-item label="用例名称" prop="case_name" >
                <el-input v-model="addCaseform.case_name"  ></el-input>
              </el-form-item>
              <el-form-item label="创建者" prop="author" >
                <el-input v-model="addCaseform.author" ></el-input>
              </el-form-item>
              <el-form-item label="所属项目" prop="belong_project" >
                <el-select v-model="addCaseform.belong_project" placeholder="请选择项目" @change="projectSelectChange(addCaseform.belong_project)" filterable>
                  <el-option v-for="project in projectList" :key="project.id" :label="project.project_name" :value="project.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属模块" prop="belong_module" >
                <el-select v-model="addCaseform.belong_module" placeholder="请选择模块" @change="moduleSelectChange(addCaseform.belong_module)" filterable>
                  <el-option v-for="module in moduleList" :key="module.id" :label="module.module_name" :value="module.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="添加配置" prop="include" >
                <el-select v-model="addCaseform.include" placeholder="请选择配置" filterable>
                  <el-option v-for="include in includeList" :key="include.id" :label="include.case_name" :value="include.id"></el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="request">
              <el-form-item label="请求类型" prop="reqMethod" >
                <el-select v-model="addCaseform.reqMethod" placeholder="请选择请求类型" >
                  <el-option label="GET" value="get"></el-option>
                  <el-option label="POST" value="post"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="请求路径" prop="path">
                <el-input v-model="addCaseform.path"></el-input>
              </el-form-item>
              <el-form-item label="headers" prop="headers">
                <el-input v-model="addCaseform.headers"></el-input>
              </el-form-item>
              <el-form-item label="params" prop="params">
                <el-input v-model="addCaseform.params"></el-input>
              </el-form-item>
              <el-form-item label="data" prop="data"  v-if="addCaseform.reqMethod==='post'">
                <el-input v-model="addCaseform.data" ></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="except/validate">
              <el-form-item label="预期结果" prop="expect" aria-placeholder="222">
                <el-input v-model="addCaseform.expect" ></el-input>
              </el-form-item>
              <el-form-item label="验证参数" prop="validate" aria-placeholder="">
                <el-input v-model="addCaseform.validate" ></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addCaseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCase">确 定</el-button>
          </span>
        </template>
      </el-dialog>


      <!--调试用例对话框-->
      <el-dialog title="调试用例" :visible.sync="debugCaseDialogVisible" center width="60%" :before-close="debugCaseDialogBeforeClose" @close="debugCaseDialogClose">

        <div class="select_evn">
          <p >skdj</p>
          <el-select v-model="evnHost" placeholder="请选择运行环境" >
            <el-option v-for="evnhost in evnHostList" :key="evnhost.id" :label="evnhost.evn_name" :value="evnhost.id"></el-option>
          </el-select>
        </div>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="debugCaseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCase">确 定</el-button>
          </span>
        </template>
      </el-dialog>


   </div>
</template>

<script>
    export default {
        name: "TestList",
        data() {
            return {

                // 用例表格数据
                caseList:[],
                // 项目列表
                projectList:[],
                // 模块列表
                moduleList:[],
                // 配置列表
                includeList:[],
                // 选中的用例列表
                caseListSelect: [],

                // select选中的项目名称
                selectProject: '',
                // 获取用例列表的参数
                queryInfo: {
                    query: '',
                    // 用例类型为 1
                    type:1,
                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 10,
                },
                total: 0,
                // 环境域名
                evnHost:'',
                // 环境选项
                evnHostList:[
                    {
                      id: '选项1',
                      evn_name: '黄金糕'
                    }, {
                      id: '选项2',
                      evn_name: '双皮奶'
                    },
                ],

                // 控制添加用例对话框显示隐藏
                addCaseDialogVisible:false,

                // 控制调试用例对话框显示隐藏
                debugCaseDialogVisible:false,

                // 添加用例表单
                addCaseform:{
                    case_name:'',
                    belong_module:'',
                    belong_project:'',
                    author:'',
                    status:1,
                    reqMethod:'',
                    path:'',
                    headers: '',
                    params: null,
                    data: null,
                    caseType:1,
                    expect: null,
                    validate: null,
                    include:null,
                },

                // 编辑用例表单
                editCaseForm:{
                    id:'',
                    case_name:'',
                    belong_module:'',
                    belong_project:'',
                    author:'',
                    status:'',
                    reqMethod:'',
                    headers: '',
                    params: null,
                    data: null,

                },

                // 表单验证
                fromRules: {
                    case_name: [
                        { required: true, message: '请输入用例名称', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    author:[
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    belong_project:[
                        { required: true, message: '请输入项目名称', trigger: 'change' },
                    ],
                    belong_module:[
                        { required: true, message: '请输入模块名称', trigger: 'change' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    reqMethod:[
                        { required: true, message: '请选择情趣方式', trigger: 'change' }
                    ],
                    path:[
                        { required: true, message: '请输入请求路径', trigger: 'blur' }
                    ],
                    headers:[
                        { required: true, message: '请输入headers参数', trigger: 'blur' },
                    ],
                    params:[
                        { required: true, message: '请输入params参数', trigger: 'blur' },
                    ],
                    data:[
                        { required: true, message: '请输入data参数', trigger: 'blur' },
                    ],
                    expect:[
                        { required: true, message: '请输入预期结果值', trigger: 'blur' }
                    ],
                    validate:[
                        { required: true, message: '请输入验证参数', trigger: 'blur' }
                    ]

                },


            };

        },
        created() {
            this.getCaseList()
        },
        methods:{
            getCaseList:async function () {
                console.log(this.queryInfo)
                console.log(this.selectProject)

                const {data:res} = await this.$http.get('auto_api/caselist',{params:this.queryInfo})
                if (res.code !== 200){
                    return this.$message.error('获取用例列表失败')
                }

                this.caseList = res.data.caseList
                this.total = res.data.total
            },

            // 展示添加用例对话框
            showDialog:async function () {
                const {data:resProjectList} = await this.$http.get('auto_api/projectlist')
                this.projectList = resProjectList.data.projectList

                this.addCaseDialogVisible = true
            },

            // 添加用例
            addCase:async function() {
                this.$refs.addCaseFormRef.validate( async (valid) => {
                    console.log(valid)
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }

                    const {data:res} = await this.$http.post('auto_api/caselist',this.addCaseform)
                    if (res.code !== 200) {
                        return this.$message.error('添加用例失败')
                    }

                    this.$message.success('测试用例添加成功')
                    this.getCaseList()
                    this.addCaseDialogVisible = false
                    this.$refs.addCaseFormRef.resetFields()


                })

            },

            // 选择项值
            caseSelectionChange:function (val) {
                this.caseListSelect = val;
                console.log(val)
            },

            // 分页数量 切换触发
            casehandleSizeChange:function (newSize) {
                console.log('分页数量:',newSize)
                this.queryInfo.pagesize = newSize
                this.queryInfo.pagenum = 1
                this.getCaseList()
            },

            // 分页码值 改变触发
            casehandleCurrentChange:function (newPage) {
                console.log('分页码值:',newPage)
                this.queryInfo.pagenum = newPage
                this.getCaseList()
            },

            // 添加用例模块select选择项目值时触发
            moduleSelectChange:async function (moduleId) {
                console.log(moduleId)
                const {data:resconfigList} = await this.$http.get('auto_api/caselist',{params:{moduleId:moduleId,type:2}})
                this.addCaseform.include = null
                this.includeList = resconfigList.data.caseList
            },

            // 添加用例项目select选择项目值时触发
            projectSelectChange:async function (projectId) {
                console.log(projectId)
                const {data:resmoduleList} = await this.$http.get('auto_api/modulelist',{params:{projectId:projectId}})
                this.addCaseform.belong_module = null
                this.addCaseform.include = null
                this.moduleList = resmoduleList.data.moduleList
            },

            // 关闭前执行监听添加用例对话框的关闭事件
            addCaseDialogBeforeClose:function (done) {
                this.$confirm('关闭后不会保存填写的数据！').then(_ => {
                    done();
                    this.$refs.addCaseFormRef.resetFields()
                })
            },

            // 关闭后执行监听添加调试用例对话框的关闭事件
            addCaseDialogClose:function(){
                this.$refs.addCaseFormRef.resetFields()
            },
            // 关闭前执行监听添加用例对话框的关闭事件
            debugCaseDialogBeforeClose:function (done) {
                this.$confirm('关闭后不会保存填写的数据！').then(_ => {
                    done();
                    this.$refs.addCaseFormRef.resetFields()
                })
            },

            // 关闭后执行监听添加调试用例对话框的关闭事件
            debugCaseDialogClose:function(){
                this.$refs.addCaseFormRef.resetFields()
            },

            // 点击调试按钮运行用例
            debugCase:async function (id) {
                console.log('用例ID：',id)
                // var caseListId = new Array(2)
                var caseListId = []
                caseListId.push(id)

                this.debugCaseDialogVisible = true

                // const {data:res} =await this.$http.post('auto_api/runcase',{caseListId:caseListId})
                // if (res.code === 200) {
                //     console.log(res.data)
                //     location.href = 'http://0.0.0.0:8001/auto_api/case_report_html/' + res.data.fileName
                // }

            },

            // 点击调试运行选中用例
            debugMoreCase:async function() {
                console.log(this.caseListSelect)
                if (this.caseListSelect.length !== 0) {
                    const {data:res} = await this.$http.post('auto_api/runcase',{caseListId:this.caseListSelect})
                    if (res.code !== 200 ) {
                        return this.$message.error("运行失败")
                    }
                    location.href = 'http://0.0.0.0:8001/auto_api/case_report_html/' + res.data.fileName

                } else {
                    return this.$message.info("请至少选择一个用例运行")
                }
            },
        }
    }
</script>

<style scoped Lang="less">
  .select_evn{
    text-align: center;
    padding: 0 0;
  }
</style>
