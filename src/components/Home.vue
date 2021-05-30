<template>
    <el-container class="home-containaer">

        <!--头部区域-->
        <el-header>
            <div class="header-div1">
                <img src="../assets/response.png">
                <span class="header-span1">移动电影院</span>
            </div>
            <el-button type="success" @click="logout" style="margin-right: 20px" size="small" plain>退出登录</el-button>
        </el-header>

        <!--页面主体区域-->
        <el-container>
            <!--页面侧边栏-->
            <el-aside :width="asideSize">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu text-color="hotpink" active-text-color="red" unique-opened :collapse="iscollapse" :collapse-transition="false"
                         :router="true" :default-active="activePath" background-color="darkslategray">
                  <!--一级菜单-->
                  <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
                    <!--一级菜单模版区域-->
                    <template #title>
                      <!--图标-->
                      <i :class="icoObj[item.id]"></i>
                      <!--文本-->
                      {{item.authName}}
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
                    '125':'el-icon-user-solid',
                    '103':'el-icon-star-on',
                    '101':'el-icon-s-goods',
                    '102':'el-icon-s-help',
                    '145':'el-icon-upload',

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
                const {data:res} = await this.$http.get('menus');
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
        background-color: coral;
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
        }
    .el-aside {
        background-color: cadetblue;
    }
    .el-menu {
        border-right: none;

    }
    .el-main {
        background-color: cornsilk;
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
        color: magenta;
        text-align: center;
        letter-spacing: 0.2em;  /*文本的间距*/
        cursor: pointer;    /* 鼠标选中后变成小手形状*/
    }
    img {
        margin-left: 5px;
        width: 56px;
        height: 56px;
    }
</style>
