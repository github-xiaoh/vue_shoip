<template>
  <div>
    <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>测试管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加首映礼</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->
      <el-card class="box-card" >

        <!--搜索与添加区域-->
        <el-form ref="PremiereFormRef" :model="PremiereForm" :rules="PremiereRules" label-width="100px" size="small">
          <el-form-item label="活动主题">
            <el-input v-model="PremiereForm.name" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="首映礼电影">
            <el-select v-model="PremiereForm.region" placeholder="请选择活动电影">
              <el-option label="电影一" value="shanghai"></el-option>
              <el-option label="电影二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开映时间">
            <el-col :span="5">
              <el-date-picker type="date" placeholder="选择日期" v-model="PremiereForm.date1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col :span="0.5">-</el-col>
            <el-col :span="5">
              <el-time-picker placeholder="选择时间" v-model="PremiereForm.date2" style="width: 100%;"></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="数据美化">
            <el-switch v-model="PremiereForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="PremiereForm.type">
              <el-checkbox label="功能验证" name="type"></el-checkbox>
              <el-checkbox label="数据美化" name="type"></el-checkbox>
              <el-checkbox label="机器人场景" name="type"></el-checkbox>
              <el-checkbox label="正式数据" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="互动方式">
            <el-radio-group v-model="PremiereForm.resource">
              <el-radio label="语音互动"></el-radio>
              <el-radio label="直播互动"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="场次描述">
            <el-input type="textarea" v-model="PremiereForm.desc" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" >立即创建</el-button>
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
        name: "Premiere",
        data() {
            return {
                PremiereForm : {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                PremiereRules: {
                    name: [
                      { required: true, message: '请输入活动名称', trigger: 'blur' },
                      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    region: [
                      { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    date1: [
                      { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    date2: [
                      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    type: [
                      { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                    ],
                    resource: [
                      { required: true, message: '请选择活动资源', trigger: 'change' }
                    ],
                    desc: [
                      { required: true, message: '请填写活动形式', trigger: 'blur' }
                    ]
                }
            };
        },
        methods:{

        }
    }
</script>

<style scoped>

    .box-card2 {
        margin-top: 20px ;
    }

</style>
