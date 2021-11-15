<template>
  <div>
    <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>测试管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加影片</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >
        <div style="width: 100%;height: 30px;color:#0e9aef;">创建基本信息</div>
        <!--搜索与添加区域-->
        <el-form ref="createFilmFormRef" :model="createFilmForm" :rules="createFilmRules" label-width="130px" label-position="right" size="small">
          <el-form-item label="搜索影片名查找ID">
            <el-row :gutter="30">

              <el-col :span="5">
                <el-select v-model="createFilmForm.filmId" placeholder="请输入电影名称" filterable>
                  <el-option v-for="filmInfo in filmList" :key="filmInfo.filmId" :label="filmInfo.filmName" :value="filmInfo.filmId"></el-option>
                </el-select>
              </el-col>

              <el-col :span="6" style="width: 180px;">
                <el-input v-model="createFilmForm.filmId" :disabled="true"></el-input>
              </el-col>

              <el-col :span="5">
                <el-input v-model="createFilmForm.filmName" placeholder="请输入影片名称"></el-input>
              </el-col>

              <el-col :span="4">
                <el-form-item>
                  <el-button type="primary" @click="createFilmBaseInfo">保存</el-button>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form-item>

        </el-form>

      </el-card>

      <el-card class="box-card2" >
        <div style="width: 100%;height: 30px;color:#0e9aef;">上线影片</div>
        <el-form ref="releaseFilmFormRef" :model="releaseFilmForm" :rules="createFilmRules" label-position="right" size="small">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="同步电影" prop="filmId">
                <el-select v-model="releaseFilmForm.filmId" placeholder="请选择活动电影" filterable allow-create>
                  <el-option v-for="syncfilmInfo in syncfilmInfoList" :label="syncfilmInfo.filmName" :value="syncfilmInfo.filmId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="影片上下线时间" style="width: 100%" prop="filmTime">
                <el-date-picker type="datetimerange" value-format="timestamp" placeholder="选择日期" v-model="releaseFilmForm.filmTime" style="width: 340px;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="margin-left: 100px">
            <el-button type="primary" @click="clickReleaseFilm" >立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>

      </el-card>

      <el-card class="box-card2">
        <el-row :gutter="30">
          <el-form  label-width="100px" size="small">
            <el-col :span="8">
              <el-form-item label="主持人手机号">
                <el-input  style="width: 150px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary">保存</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

      </el-card>
  </div>
</template>

<script>
    export default {
        name: "Createfilm",
        data() {
            return {
                createFilmForm : {
                    filmName: '',
                    filmId:'',
                    region: '',
                    channel: 'test'
                },
                releaseFilmForm : {
                    filmName: '',
                    filmId:'',
                    region: '',
                    filmTime: '',
                    channel: 'test'
                },

                // 媒资影片列表
                filmList:[],
                // 待同步的影片列表
                syncfilmInfoList:'',

                createFilmRules: {
                    filmId: [
                      { required: true, message: '请选择活动名称', trigger: 'change' }
                    ],
                    region: [
                      { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    filmTime: [
                      { required: true, message: '请选择日期', trigger: 'change' }
                    ]
                }
            };
        },
        created(){
            this.getfilmList()
        },
        methods:{

            // 获取媒资影片信息列表
            getfilmList:async function () {
                const {data:res} = await this.$http.get('user_ch/getfilmzh',{params:this.createFilmForm})
                if (res.code === 0) {
                    this.filmList = res.filmList
                    this.syncfilmInfoList = res.syncFilmList
                }
            },

            // 创建影片基本信息
            createFilmBaseInfo:async function () {
                console.log(this.createFilmForm.name)
                const {data:res} = await this.$http.post('user_ch/createbaseInfo',this.createFilmForm)
                if (res.code === 0) {
                    this.$refs.createFilmFormRef.resetFields()
                    this.$message.success('影片基本信息创建成功')
                }
            },



            clickReleaseFilm() {
                console.log('点击提交按钮')
                console.log(this.releaseFilmForm)
                this.$refs.releaseFilmFormRef.validate(async (valid) => {
                  if (!valid) {
                          return this.$message.error('请检查填写信息后提交')
                  } else {
                      const {data:res} = await this.$http.post('user_ch/createsyncFilm',this.releaseFilmForm)
                      if (res.code === 0) {
                          this.$refs.createFilmFormRef.resetFields()
                          this.$message.success('影片上线成功')
                      }else this.$message.error(res.msg + "，影片上线失败")
                  }
                });
            },
            resetForm(releaseFilmFormRef) {
              this.$refs[releaseFilmFormRef].resetFields();
            }
        }
    }
</script>

<style scoped Lang="less">
  .box-card2 {
        margin-top: 20px ;
    }

</style>
