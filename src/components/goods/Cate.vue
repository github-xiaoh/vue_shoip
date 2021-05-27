<template>
  <div>
    <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </template>


      <!--卡片内容区域-->
      <el-card class="box-card" >
        <el-row>
          <el-col>
            <el-button type="primary" @click="showAddCate">添加商品</el-button>
          </el-col>
        </el-row>

        <!--商品列表表格数据-->
        <el-table :data="cateList" border row-key="cat_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="index" label="#" ></el-table-column>
          <el-table-column prop="cat_name" label="分类名称" >
          </el-table-column>
          <el-table-column prop="cat_deleted" label="是否有效" >
            <template #default="props">
              <i v-if="props.row.cat_deleted === true" class="el-icon-error" style="color: #EAA028"></i>
              <i v-if="props.row.cat_deleted === false" class="el-icon-success" style="color: #13C610" ></i>
            </template>
          </el-table-column>
          <el-table-column prop="cat_level" label="排序" >
            <template #default="props">
              <el-tag v-if="props.row.cat_level === 0" size="mini" effect="dark">一级</el-tag>
              <el-tag v-if="props.row.cat_level === 1" size="mini" type="success" effect="dark">二级</el-tag>
              <el-tag v-if="props.row.cat_level === 2" size="mini" type="warning" effect="dark">三级</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column prop="" label="test" >-->
            <!--<template #default="props">-->
              <!--<P>{{props.row}}</P>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="操作" prop="" >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click=""></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" circle size="mini" @click=""></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" circle size="mini" @click=""></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--分页区域-->
        <el-pagination @size-change="catehandleSizeChange" @current-change="catehandleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>

      <!--添加商品对话框-->
      <el-dialog title="提示" :visible.sync="cateDialogVisible" width="60%" @close="closeCateDialogVisible" >
        <el-form :model="cateForm" :rules="addCateRules" ref="cateFormRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="cateForm.cat_name" placeholder="请输入分类名称" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="selectKeys">
            <el-cascader v-model="cateForm.selectKeys" :options="cateParentList" :props="cateCascaderProps" @change="cateHandleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </template>
      </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "Cate",
        data() {
            return{
                // 商品分类的列表
                cateList:[],

                // 提交的查询表单
                queryInfo:{
                    type:'',
                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 5,
                },

                // 页面总数据
                total:0,

                // 添加商品对话框默认隐藏
                cateDialogVisible: false,

                // 添加商品内容
                cateForm:{
                    cat_name:'',
                    cat_id:'',
                    // 等级ID，默认添加的是1级分类
                    cat_level:0,
                    // 父级分类ID,
                    cat_pid: 0,
                    // 选中的父级分类的ID数组
                    selectKeys:[],
                },

                // 添加商品对话框规则
                addCateRules:{
                    cat_name: [
                        { required: true, message: '分类名称不能为空', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    selectKeys: [
                         { required: true, message: '父级分类不能为空', trigger: 'change' }
                     ],
                },

                // cascader 级联选择器数据
                cateParentList:[],

                // 指定级联选择器的配置选项
                cateCascaderProps:{
                    checkStrictly: true,
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label:'cat_name',
                    children: 'children',
                },

            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            // 获取商品数据列表
            getCateList:async function () {
                const {data:res} = await this.$http.get('categories',{params:this.queryInfo})

                if (res.meta.status !== 200) {
                    return this.$message.error("获取商品分类失败")
                }
                console.log(res)
                // 吧数据赋值给表格列表
                this.cateList = res.data.result
                console.log('123:'+res.data.result)
                // 为总数居条数赋值
                this.total = res.data.total
            },

            // 分页数量 切换触发
            catehandleSizeChange:function (newSize) {
                console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },

            // 分页码值 改变触发
            catehandleCurrentChange:function (newPage) {
                console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },

            // 添加商品对话框展示
            showAddCate:async function () {

                this.getParentCateList()
                this.cateDialogVisible = true

            },

            // 获取分类商品类标
            getParentCateList:async function() {

                const {data:res} = await this.$http.get('categories',{params:{type:2}})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败')
                }
                this.cateParentList = res.data
                // this.$message.success('获取商品分类成功')
            },

            // 监听关闭cate对话框，清空表单验证
            closeCateDialogVisible:function () {
                this.$refs.cateFormRef.resetFields()
            },

            // 改变商品对话框中的分类选择触发
            cateHandleChange:function () {
                console.log(this.cateForm.selectKeys)
                // 如果 selectKeys 长度大于0 证明选中分类
                // 如果 selectKeys 长度小于0 证明没有选中
                if (this.cateForm.selectKeys.length > 0) {
                    console.log("进来了")
                    // 为父级分类赋值
                    this.cateForm.cat_pid = this.cateForm.selectKeys[this.cateForm.selectKeys.length-1]

                    // 为当前分类的等级赋值
                    this.cateForm.cat_level = this.cateForm.selectKeys.length
                    return
                } else {
                    // 父类分类的id
                    this.cateForm.cat_pid = 0
                    // 分类分类的id
                    this.cateForm.cat_level = 0
                }

            },

            // 添加商品分类
            addCate:async function () {
                console.log(this.cateForm)
                const {data:res} = await this.$http.post('categories',this.cateForm)

                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                this.cateDialogVisible = false
                this.getCateList()
                this.$message.success('添加分类成功')

            }
        }
    }
</script>

<style scoped>

</style>
