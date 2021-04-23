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

      <el-button type="primary" size="medium">添加角色</el-button>

      <el-table :data="RolesList" border>
        <el-table-column type="expand" >
          <template slot-scope="scope">
            <!--珊格布局标签-->
            <el-row :class="['bdbuttom',i1 === 0 ? 'bdtop' : '','vcenter' ]" v-for=" (item1,i1) in scope.row.children " :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环来渲染二级权限-->
                <el-row class="vcenter" :class="[i2 === 0 ? '' : 'bdtop']" v-for=" (item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag @close="removeRightById(scope.row,item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                     <el-tag @close="removeRightById(scope.row,item3.id)" v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable>{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--<pre>-->
              <!--{{scope.row}}-->
            <!--</pre>-->
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" ></el-table-column>
        <el-table-column label="角色名称" prop="roleName" ></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" ></el-table-column>
        <el-table-column label="操作" prop="" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
      <el-tree :data="rightsList" :props="treeProps" node-key="id" :default-checked-keys="defKeys" ref="treeRef" show-checkbox default-expand-all >
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                RolesList:[],

                // 控制编辑用户对话框的显示和隐藏
                setRightDialogVisible: false,
                // 权限(树)数据展示
                rightsList:[],
                // 树控件属性绑定对象
                treeProps:{
                    label: 'authName',
                    children: 'children',
                },
                // 默认被选中的节点树数组
                defKeys:[],
                // 当前即将分配权限的角色ID
                roleId:'',
            }
        },
        created() {
            this.getRolesList()
        },
        methods:{
            // 获取角色权限列表
            getRolesList:async function () {
                const {data:res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败')
                }

                this.RolesList = res.data
                console.log(this.RolesList)
            },

            // 根据ID删除对应的权限
            removeRightById:async function (role,rightId) {
                // 弹窗提示用户是否删除
                const confirmResult =  await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).catch(() => {
                      this.$message({
                          type: 'info',
                          message: '操作已取消'
                      })
                })
                if (confirmResult === 'confirm') {
                    console.log('roleId:' + role.id)
                    const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除权限失败')
                    }
                    // this.getRolesList()  //调取新数据后回导致页面下拉row恢复
                    role.children = res.data
                    return this.$message.success('删除权限成功')

                }
                console.log(confirmResult)
            },
            // 弹出分配权限对话框
            showSetRightDialog:async function (roles) {
                // 将获取的角色ID 赋值给data
                this.roleId = roles.id

                // 获取所有权限的数据
                const {data:res} = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限数据失败')
                }

                // 把获取的权限数据保存到树结构数据中
                this.rightsList = res.data
                console.log(this.rightsList)

                // 递归获取三级基础权限的ID
                this.getLeafKeys(roles,this.defKeys)


                this.setRightDialogVisible = true
            },
            // 通过递归函数，获取角色的所有三级权限ID，并保存到 defKeys 中
            getLeafKeys(node,arr) {
                // 如果当前 node 节点不包含 children 属性 则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }

                node.children.forEach(item => {
                    this.getLeafKeys(item,arr)
                })
            },

            // 监听权限对话框的关闭事件
            setRightDialogClose:function () {
                this.defKeys = []
            },

            // 提交权限数据,为角色分配权限
            allotRights:async function () {

                const rightsKeys = [
                    ...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                console.log(rightsKeys)

                const idStr = rightsKeys.join(',')
                const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids : idStr })
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败')
                }

                this.$message.success('分配权限成功')
                // 获取最新的角色权限列表
                this.getRolesList()

                this.setRightDialogVisible = false
            }
        }
    }
</script>

<style Lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbuttom {
    border-bottom: 1px solid #eee;
  }

  .bdleft {
    border-left: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
