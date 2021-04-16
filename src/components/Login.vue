<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!--登录表单区域-->
            <el-form ref="loginFormRef" :rules="loginFormRule" class="login_form" :model="login_Form" label-width="80px">
                <!--用户名-->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="login_Form.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="login_Form.password" prefix-icon="el-icon-s-goods" show-password></el-input>
                </el-form-item>
                <!--按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return {
                kkkk:"",
                login_Form:{
                    username:"",
                    password:"",
                },

                // 表单验证规则对象
                loginFormRule:{
                    // 验证用户名是否合法
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{

            // 点击重置按钮，重置登录表单
            resetLoginForm:function () {
                // console.log(this)
                this.$refs.loginFormRef.resetFields();
            },

            // 登录前的预验证
            login:function () {
                this.$refs.loginFormRef.validate( async (valid) => {
                    console.log(valid);
                    if (!valid){return}
                    const result = await this.$http.post("login",this.login_Form)
                    console.log(result.data)
                    if (result.data.meta.status !== 200){
                        return this.$message.error('登录失败')
                    } else {
                        console.log("登录成功")
                        this.$message.success("登录成功")
                    }

                    // 1、将登陆成功之后的token 保存到客户端的 sessionStirage 中
                    //     1、1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
                    //     1、2 token 只应用在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
                    // console.log(result.data)
                    window.sessionStorage.setItem("token",result.data.data.token)
                    // 2、通过编程式导航跳转到后台主页，路由地址是 /home
                    this.kkkk = window.sessionStorage.getItem('token')
                    console.log('kkk: ',this.kkkk)
                    this.$router.push('/home')

                })

            }
        }
    }
</script>

<style Lang="less" scoped>
    .login_container{
        background-color: #C0C4CC;
        height: 100%;
    }
    .login_box{
        width:430px;
        height: 300px;
        background-color: #DCDFE6;
        border-radius: 3px;
        box-shadow: 0 0 30px #909399;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .avatar_box{
        height: 100px;
        width: 100px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: aliceblue;

    }
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #F2F6FC;
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 90%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: center;
    }


</style>
