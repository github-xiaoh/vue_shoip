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
        <!--搜索与添加区域-->
        <el-row :gutter="30">

          <el-col :span="9">
            <el-input placeholder="请输入用户昵称" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList" ></el-button>
            </template>
          </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!--用户列表区域-->
        <el-table :data="userList" border stripe >
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="用户ID" prop="id" ></el-table-column>
          <el-table-column label="姓名" prop="u_nickname" ></el-table-column>
          <el-table-column label="更新时间" prop="u_update_time" ></el-table-column>
          <el-table-column label="电话" prop="u_mobile" ></el-table-column>
          <el-table-column label="头像" prop="" >
            <template slot-scope="scope">
              <el-image style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.u_image" fit="fill" :preview-src-list="[scope.row.u_image]"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="u_status" >
            <!--作用域插槽使用获取userList数据 {{scope.row}} 使用作用域插槽后可以去掉prop属性，因为作用域插槽优先级要高 -->
            <template slot-scope="scope" >
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" circle size="mini"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeUserByid(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--用户分页区域-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

      </el-card>

      <!--添加用户的对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="60%" @close="addDialogClose">
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="addUser">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 编辑用户的对话框-->
      <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="60%" @close="editDialogClose">
        <!--内容主体区域-->
        <el-form :model="editForm" :rules="editFromRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary"  @click="editUserInfo">确 定</el-button>
          </span>
        </template>
      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {

            // 验证邮箱的规则
            var checkEmail = (rule,value,callback) => {
                // 验证邮箱的正则表达式
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]))+/
                if (regEmail.test(value)) {
                    // 合法邮箱
                    return callback()
                }
                callback(new Error('请输入合法的邮箱'))
            };

            var checkMobile = (rule,value,callback) => {
                // 验证手机的正则表达式
                const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
                if (regMobile.test(value)) {
                    // 合法手机号
                    return callback()
                }
                callback(new Error("请输入合法的手机号"))
            };

            return {

                // 获取用户列表的参数
                queryInfo: {
                    query: '',

                    // 当前的页面在第几页
                    pagenum: 1,
                    // 当前页面显示多少条数据
                    pagesize: 10,
                },
                userList: [],
                total: 0,

                // 控制添加用户对话框的显示和隐藏
                addDialogVisible : false,

                // 控制编辑用户对话框的显示和隐藏
                editDialogVisible : false,

                // 添加用户的表单数据
                addForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:'',

                },

                // 编辑用户的表单数据
                editForm:{},

                // 用户表单验证
                addFromRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],

                },

                // 编辑用户验证
                editFromRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],

                }
            }
        },

        created() {
            this.getUserList();
        },

        methods:{
            async getUserList() {
                const {data:res} = await this.$http.get('user_ch/users',{params: this.queryInfo})
                if (res.code !== 200) {
                    return this.$message.error("获取用户列表失败")
                }
                this.userList = res.data.userList;
                this.total = res.data.total;
                console.log(res)
            },

            // 分页数量 切换触发
            handleSizeChange:function (newSize) {
                console.log(newSize)
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },

            // 分页码值 改变触发
            handleCurrentChange:function (newPage) {
                console.log(newPage)
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },

            // 监听状态开关的改变
            async userStateChanged(userinfo) {
                console.log(userinfo)
                const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户失败')
                }
                this.$message.success('更新状态成功')
            },

            // 监听添加用户对话框的关闭事件
            addDialogClose:function () {
                this.$refs.addFormRef.resetFields()
            },

            // 监听编辑用户对话框的关闭事件
            editDialogClose:function () {
                this.$refs.editFormRef.resetFields()
            },

            // 添加用户之前的预验证
            addUser:function() {
                console.log("点击确定按钮")
                this.$refs.addFormRef.validate( async (valid) => {
                    console.log(valid)
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }
                    const {data:res} = await this.$http.post('users',this.addForm)

                    if (res.meta.status !== 201) {
                        return this.$message.error('添加用户失败')
                    }
                    this.$message.success('添加用户成功')

                    // 隐藏添加用户对话框
                    this.addDialogVisible = false
                    // 重新获取用户列表数据
                    this.getUserList()
                });
            },

            // 控制用户 对话框的显示和隐藏
            async showEditDialog(id) {
                console.log('id:'+id)
                const {data:res} = await this.$http.get('users/'+ id)
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户信息失败')
                }

                this.editForm = res.data
                this.editDialogVisible = true

            },

            // 修改用户信息预验证
            editUserInfo() {
                this.$refs.editFormRef.validate(async (valid) => {
                    console.log(valid)
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }
                    const {data:res} = await this.$http.put(
                        'users/'+ this.editForm.id,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        }
                    )
                    console.log(res.data)
                    if (res.meta.status !== 200) {
                        return this.$message.error('编辑用户失败')
                    }

                    // 关闭对话框
                    this.editDialogVisible = false
                    // 刷新数据列表
                    this.getUserList()
                    // 提示修改成功
                    this.$message.success('编辑用户成功')
                })
            },
            // 删除用户
            async removeUserByid (id) {
                // async 和 await 写法

                console.log('id:'+id)

                const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).catch((error) => {
                    this.$message({
                      type: 'info',
                      message: '取消删除'
                    });
                  });

                if (confirmResult === 'confirm') {
                    const {data:res} = await this.$http.delete('users/' + id)
                    console.log('id:'+id)
                    if (res.meta.status !== 200 ) {
                        return this.$message.error('删除失败')
                    }else {
                        this.$message.success('用户已删除')
                        this.getUserList()
                    }
                }
                if (confirmResult === 'cancel') {
                    this.$message.info('已取消删除')
                }
                // if (confirmResult == '')

                // 确认返回 文本字符串 confirm 点击取消返回 字符串 cancel
                console.log(confirmResult)


                // 写法等同上面的写法
                // this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                //   }).then(() => {
                //     this.$message({
                //       type: 'success',
                //       message: '删除成功!'
                //     });
                //   }).catch(() => {
                //     this.$message({
                //       type: 'info',
                //       message: '已取消删除'
                //     });
                //   });
                // this.$confirm返回一个promise 对象
                // console.log()
            }
        }

    }
</script>

<style lang="less" scoped>

</style>
