<template>
  <div>
    <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>测试管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加专场</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >

        <!--搜索与添加区域-->
        <el-form ref="SpecialFormRef" :model="SpecialForm" :rules="SpecialRules" label-width="100px" size="small">
          <el-form-item label="活动主题" prop="SpecialName">
            <el-input v-model="SpecialForm.specialName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="首映礼电影" prop="spuinfo">
            <el-select v-model="SpecialForm.spuinfo" placeholder="请选择电影" filterable>
              <el-option v-for="spuinfo in spuList" :key="spuinfo.id" :label="spuinfo.filmName" :value="spuinfo.filmId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="嘉宾(咖)" prop="userGuestId">
            <el-select v-model="SpecialForm.userGuestId" placeholder="请选择人员" filterable>
              <el-option v-for="userGuestId in userGuestList" :key="userGuestId.id" :label="userGuestId.nickname" :value="userGuestId.userId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开映时间" prop="beignTime">
            <el-col :span="5">
              <el-date-picker type="datetime" placeholder="选择日期时间" v-model="SpecialForm.beignTime" value-format="timestamp" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="数据美化" style="color: #0d8ddb" prop="beautifyStatus">
            <el-switch v-model="SpecialForm.beautifyStatus"></el-switch>   (开启后默认1000人)
          </el-form-item>
          <el-form-item label="互动方式">
            <el-radio-group v-model="SpecialForm.interactionType" prop="interactionType">
              <el-radio label="0" >语音互动</el-radio>
              <el-radio label="1" >直播互动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="场次描述" prop="remark">
            <el-input type="textarea" v-model="SpecialForm.remark" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm" >立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>

      </el-card>

      <!--<el-card class="box-card2">-->
        <!--<el-form  ref="hostFormRef" :model="hostForm" :rules="SpecialRules"  size="small" >-->
          <!--<el-row :gutter="20">-->
            <!--<el-col :span="6">-->
              <!--<el-form-item label="主持人手机号" prop="hostMobile" >-->
                <!--<el-input v-model="hostForm.hostMobile" style="width: 150px" placeholder="请输入手机号"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="4">-->
              <!--<el-form-item label="房间号" prop="roomId" >-->
                <!--<el-input v-model="hostForm.roomId" style="width: 80px" placeholder="roomId"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="4">-->
              <!--<el-form-item>-->
                <!--<el-button type="primary">保存</el-button>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->
        <!--</el-form>-->
      <!--</el-card>-->
  </div>
</template>

<script>
    export default {
        name: "Special",
        data() {

            var checkMobile = (rule,value,callback) => {
                // 验证手机的正则表达式
                const regMobile = /^[1][3,4,5,7,8,9][0-9]{9}$/
                if (regMobile.test(value)) {
                    // 合法手机号
                    return callback()
                }
                callback(new Error("请输入合法的手机号"))
            };

            return {

                // 环境参数
                channel:'test',
                // 影片列表
                spuList:'',
                // 咖列表
                userGuestList:'',

                SpecialForm : {
                    specialName: '',
                    spuinfo: '',
                    userGuestId:'',
                    beignTime: '',
                    beautifyStatus:false,
                    interactionType: '0',
                    remark: '',
                    channel:'test'
                },

                hostForm:{
                    hostMobile:'',
                    roomId:'',
                },

                SpecialRules: {
                    specialName: [
                      { required: true, message: '请输入活动名称', trigger: 'blur' },
                      { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    spuinfo: [
                      { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    beignTime: [
                      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    interactionType: [
                      { required: true, message: '请选择活动形式', trigger: 'change' }
                    ],
                    remark: [
                      { required: true, message: '请填写活动描述', trigger: 'blur' }
                    ],
                    hostMobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],
                    roomId: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ]
                }
            };
        },
        created(){
            this.getSpuList()
        },
        methods:{

            getSpuList:async function() {
                console.log("获取SPU列表信息")
                const {data:res} = await this.$http.get('/user_ch/createspecial',{params:{channel:this.channel}})
                if (res.code === 0) {
                    this.spuList = res.spuList
                    this.userGuestList = res.userGuestList
                }
            },

            submitForm:function() {
                console.log('点击提交按钮')
                console.log(this.SpecialForm)
                this.$refs.SpecialFormRef.validate(async (valid) => {
                  if (!valid) {
                          return this.$message.error('请检查填写信息后提交')
                  } else {
                      if (this.SpecialForm.beautifyStatus) {this.SpecialForm.beautifyStatus = 1}else {this.SpecialForm.beautifyStatus = 0}
                      const {data:res} = await this.$http.post('/user_ch/createspecial',this.SpecialForm)
                      if (res.code === 0) {
                          this.$refs.SpecialFormRef.resetFields()
                          return this.$message.success('创建专场成功')
                      }else {
                          return this.$message.error(res.msg+"，创建专场失败")
                      }
                  }
                });
            },

        }
    }
</script>

<style scoped>

    .box-card2 {
        margin-top: 20px ;
    }

</style>
