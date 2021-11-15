<template>
    <el-container class="home-containaer">

        <!--头部区域-->
        <el-header>
            <div class="header-div1">
                <img src="../assets/response.png">
                <span class="header-span1">移动电影院</span>
            </div>
            <el-button type="primary" @click="logout" style="margin-right: 20px" size="small" plain>退出登录</el-button>
        </el-header>

        <!--页面主体区域-->
        <el-container>
            <!--页面侧边栏-->
            <el-aside :width="asideSize">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu text-color="#DEE2E6" active-text-color="#409EFF" unique-opened :collapse="iscollapse" :collapse-transition="false"
                         :router="true" :default-active="activePath" background-color="#111">
                  <!--一级菜单-->
                  <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
                    <!--一级菜单模版区域-->
                    <template #title>
                      <!--图标-->
                      <i :class="icoObj[item.id]"></i>
                      <!--文本-->
                      <span>{{item.authName}}</span>
                    </template>
                    <!--二级菜单-->
                    <el-menu-item :index="'/' + subItem.path + '' " v-for="subItem in item.children"
                                  :key="subItem.id" @click="saveNavState('/'+subItem.path)" >
                      <template #title>
                        <!--图标-->
                        <i class="el-icon-location"></i>
                        <!--文本-->
                         <span>{{subItem.authName}}</span>
                      </template>
                      <!--<el-menu-item index="1-4-1">选项1</el-menu-item>-->
                    </el-menu-item>

                  </el-submenu>


                  <el-submenu index="2">
                      <template #title>
                          <i class="el-icon-menu"></i>
                          <span>导航二</span>
                      </template>

                      <el-menu-item-group>
                        <template #title>分组一</template>
                        <el-menu-item index="1-1" >
                          <template #title><!--图标-->
                              <i class="el-icon-location"></i>
                              <!--文本-->
                              <span>选项一</span>
                          </template>
                        </el-menu-item>
                      </el-menu-item-group>

                      <el-menu-item-group title="分组2">
                        <el-submenu index="2-1">
                            <template #title>
                                <i class="el-icon-setting"></i>
                                <span>二级菜单</span>
                            </template>
                            <el-menu-item index="1-3">三级菜单</el-menu-item>
                        </el-submenu>
                      </el-menu-item-group>

                  </el-submenu>

                  <el-menu-item index="3" disabled>
                    <i class="el-icon-setting"></i>
                    <template #title>导航三</template>
                  </el-menu-item>

                </el-menu>

            </el-aside>
            <!--页面内容主体-->
            <el-main>
                <!--路由占位符-->
                <router-view></router-view>
            </el-main>
        </el-container>

    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 左侧菜单数据
                menulist:[],
                icoObj:{
                    '100':'el-icon-user-solid',
                    '300':'el-icon-star-on',
                    '400':'el-icon-s-goods',
                    '500':'el-icon-s-help',
                    '600':'el-icon-upload',
                    '200':'el-icon-position',

                },
                // 是否折叠，false表示默认不折叠 asideSize 表示左侧栏默认宽度 200px
                iscollapse:false,
                asideSize: '200px',
                // 被激活的链接地址
                activePath:'',

            }
        },
        created(){
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        name: "Home",
        methods:{
            logout:function () {
                window.sessionStorage.clear()
                this.$router.push('/logout')
                this.$message.success('退出登录')
            },
            // 获取所有的左侧菜单
            async getMenuList() {
                const {data:res} = await this.$http.get('user_ch/test_menus/');
                if (res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
                this.menulist = res.data
                console.log(res)
                console.log(this.menulist)
            },

            // 点击按钮切换菜单的折叠与展开
            toggleCollapse: function () {
                this.iscollapse = !this.iscollapse
                if (this.iscollapse) {
                    this.asideSize = '64px';
                    console.log(this.iscollapse)
                }else {this.asideSize = '200px'}
            },

            // 保存链接的激活状态
            saveNavState: function (activePath) {
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath
            }
        }
    }
</script>

<style Lang="less" scoped>

    .el-header {
        background-color: #111;
        display: flex;
        justify-content: space-between  ;
        padding: 0;
        align-items: center;
        font-size: 20px;

    }
    .header-div1 {
        display: flex;
        align-items: center;
    }
    .header-span1 {
        margin-left: 13px;
        color: #fff;
    }
    .el-aside {
        background-color: #111;
    }
    .el-menu {
        border-right: none;

    }
    .el-main {
        background-color: #f0f2f5;
    }

    /*整体页面高度，填充屏幕*/
    .home-containaer {
        height: 100%;
    }

    /*ico 图标间隔样式（右边距）*/
    .icofont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #2D3032;
        font-size: 15px;
        line-height: 24px;
        color: seashell;
        text-align: center;
        letter-spacing: 0.2em;  /*文本的间距*/
        cursor: pointer;    /* 鼠标选中后变成小手形状*/
    }
    img {
        margin-left: 5px;
        width: 50px;
        height: 50px;
    }
</style>
