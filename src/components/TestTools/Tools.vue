<template>
   <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>测试管理</el-breadcrumb-item>
          <el-breadcrumb-item>辅助工具</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >
        <!--国内：获取验证码-->
        <div style="width: 100%;height: 30px;color:#0e9aef;">
         国内：获取验证码
        </div>
        <el-form :model="codeFormZh" :rules="formRules" ref="codeFormRefZh" :inline="true" label-width="80px" size="mini" style="height:40px;margin-top:5px">

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="codeFormZh.mobile" placeholder="输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="环境选择" prop="channel">
            <el-select v-model="codeFormZh.channel" placeholder="测试/线上" filterable size="mini" style="width:100px">
              <el-option v-for="channel in channelList" :key="channel.id" :label="channel.channelName" :value="channel.channelName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台类型" prop="platFormType">
            <el-select v-model="codeFormZh.platFormType" placeholder="客户端/H5" filterable size="mini" style="width:100px">
              <el-option v-for="platForm in platFormTypeList" :key="platForm.id" :label="platForm.platFormName" :value="platForm.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getCodeZh" style="margin-left: 50px" round>创建</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="codeDataZh" style="width: 100%">
          <el-table-column prop="mobile" label="手机号" >
          </el-table-column>
          <el-table-column prop="msg" label="请求结果" >
          </el-table-column>
          <el-table-column prop="code" label="短信验证码">
          </el-table-column>
        </el-table>

      </el-card>

     <!--卡片内容区域-->
      <el-card class="operation-card" >
        <!--国内：获取验证码-->
        <div style="width: 100%;height: 30px;color:#0e9aef;">
          国内：影点充值
        </div>
        <el-form :model="rechangeFormZh" :rules="formRules" ref="rechangeFormRefZh" :inline="true" label-width="80px" size="mini" style="height:40px;margin-top:5px">

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="rechangeFormZh.mobile" placeholder="输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="环境选择" prop="channel">
            <el-select v-model="rechangeFormZh.channel" placeholder="测试/线上" filterable size="mini" style="width:80px">
              <el-option v-for="channel in channelList" :key="channel.id" :label="channel.channelName" :value="channel.channelName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="rechangeZh" style="margin-left: 50px" round>创建</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="rechangeDataZh" style="width: 100%">
          <el-table-column prop="mobile" label="手机号" >
          </el-table-column>
          <el-table-column prop="msg" label="请求结果" >
          </el-table-column>
          <el-table-column prop="code" label="短信验证码">
          </el-table-column>
        </el-table>

      </el-card>



   </div>
</template>

<script>
    export default {
        name: "Tools",
        data(){

            var checkMobile = (rule,value,callback) => {
                // 验证手机的正则表达式
                const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/
                if (regMobile.test(value)) {
                    // 合法手机号
                    return callback()
                }
                callback(new Error("请输入合法的手机号"))
            };

            return{

                // 国内客户端登录提交表单数据
                codeFormZh:{
                    channel:'',
                    mobile:'',
                    regionId:'0',
                    platFormType:'',
                },
                // 国内充值提交表单数据
                rechangeFormZh:{
                    channel:'',
                    mobile:'',
                    regionId:'0',
                    type:'h5',
                },

                //环境列表
                channelList:[
                    {
                        id:'1',
                        channelName:'test',
                        value:'172.19.36.182',
                    },{
                        id:'2',
                        channelName:'prod',
                        value:'172.16.231.61',
                    },
                ],

                // 平台类型
                platFormTypeList:[
                    {
                        id:'1',
                        platFormName:'客户端',
                        value:'client',
                    },{
                        id:'2',
                        platFormName:'H5',
                        value:'h5',
                    },
                ],

                // 客户端验证码信息
                codeDataZh:[],
                // 国内充值结果信息
                rechangeDataZh:[],

                // 表单验证规则
                formRules:{
                    activityName:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],
                    platFormType: [
                        { required: true, message: '请选择平台类型', trigger: 'change' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, message: '长度在 6 个字符以上', trigger: 'blur' }
                    ],
                    ticketCode:[
                        { required: true, message: '请输入赠票码', trigger: 'blur' }
                    ],
                    channel:[
                        { required: true, message: '请选择分支', trigger: 'change' }
                    ],
                },


            }
        },
        created(){

        },
        methods:{

            getCodeZh:async function () {
                console.log('获取客户端验证码-国内')
                this.$refs.codeFormRefZh.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }

                    const  {data:res} = await this.$http.get('user_ch/getcode',{params:this.codeFormZh})
                    if (res.code === 0) {
                        console.log('res',res.data)
                        this.codeDataZh = res.data
                    }
                });
            },
            rechangeZh:async function () {
                console.log('获取客户端验证码-国内')
                this.$refs.rechangeFormRefZh.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }
                    return this.$message.info('别做梦了，不能用')

                    // const  {data:res} = await this.$http.get('user_ch/getcode',{params:this.rechangeFormZh})
                    // if (res.code === 0) {
                    //     this.codeDataZhH5 = res.data
                    // }
                });
            }
        }
    }
</script>

<style Lang="less" scoped>

  .operation-card {
      margin-top: 20px;
  }

</style>
