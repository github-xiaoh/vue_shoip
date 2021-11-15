<template>
  <div>
      <!--面包屑导航区域-->
      <template>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>测试管理</el-breadcrumb-item>
          <el-breadcrumb-item>运营活动创建</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <!--卡片内容区域-->

      <!--国内：赠票码生成-->
      <el-card class="operation-card" >
        <div style="width: 100%;height: 30px;color:#0e9aef;">
          国内领票码生成
          <el-select v-model="ticketFormZh.channel" placeholder="test/prod" @change="getGoodsInfoZh" filterable size="mini" style="width:80px;margin-left:15px">
            <el-option v-for="channel in channelList" :key="channel.id" :label="channel.channelName" :value="channel.channelName"></el-option>
          </el-select>
        </div>
        <el-form :model="ticketFormZh" :rules="ticketsRules" ref="ticketFormRefZh" :inline="true" label-width="80px" size="mini" style="height:40px;margin-top:5px">
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="ticketFormZh.activityName" placeholder="输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="影片名" prop="skuId">
            <el-select v-model="ticketFormZh.skuId" placeholder="影片名" filterable>
              <el-option v-for="goods in ticketsListZh" :key="goods.skuId" :label="goods.filmName+'=>skuId:'+goods.skuId" :value="goods.skuId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createTicketClickZh" style="margin-left: 50px" round>创建</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="createTicketDataZh" style="width: 100%">
          <el-table-column prop="activityName" label="活动名称" >
          </el-table-column>
          <el-table-column prop="giveCode" label="赠票码" >
          </el-table-column>
          <el-table-column prop="code" label="兑换码">
          </el-table-column>
        </el-table>

      </el-card>




      <!--北美：赠票链接生成-->
      <el-card class="operation-card" >
        <div style="width: 100%;height: 30px;color:#0e9aef;">
          北美领票码生成
          <el-select v-model="ticketFormInc.channel" placeholder="test/prod" @change="getGoodsInfoInc" filterable size="mini" style="width:80px;margin-left:15px">
            <el-option v-for="channel in channelList" :key="channel.id" :label="channel.channelName" :value="channel.channelName"></el-option>
          </el-select>
        </div>
        <el-form :model="ticketFormInc" :rules="ticketsRules" ref="ticketFormRefInc" :inline="true" label-width="80px" size="mini" style="height:40px;margin-top:5px">
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="ticketFormInc.activityName" placeholder="输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="影片名" prop="skuId">
            <el-select v-model="ticketFormInc.skuId" placeholder="影片名" filterable>
              <el-option v-for="goods in ticketsListInc" :key="goods.skuId" :label="goods.filmName+'=>skuId:'+goods.skuId" :value="goods.skuId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createTicketClickInc" style="margin-left: 50px" round>创建</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="createTicketDataInc" style="width: 100%">
          <el-table-column prop="activityName" label="活动名称" >
          </el-table-column>
          <el-table-column prop="giveCode" label="赠票码" >
          </el-table-column>
          <el-table-column prop="code" label="兑换码">
          </el-table-column>
        </el-table>

      </el-card>

      <!--北美：手机号领票-->
      <el-card class="operation-card">
        <div style="width: 100%;height: 30px;color:#0e9aef;">北美手机号领票(+86)</div>
        <el-form :model="getTicketFormInc" :rules="ticketsRules" ref="getTicketFormRef" :inline="true" label-width="80px" size="mini" style="height:40px;margin-top:5px">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="getTicketFormInc.mobile" placeholder="输入赠送手机号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="getTicketFormInc.password" placeholder="输入赠送skuId"></el-input>
          </el-form-item>
          <el-form-item label="领票码" prop="ticketCode">
            <el-input v-model="getTicketFormInc.ticketCode" placeholder="输入赠票码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTicketClickInc" style="margin-left: 50px" round>创建</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="getTicketDataInc" style="width: 100%">
          <el-table-column prop="date" label="手机号" >
          </el-table-column>
          <el-table-column prop="name" label="领取结果" >
          </el-table-column>
        </el-table>

      </el-card>

      <el-card class="operation-card">
        <h3>敬请期待</h3>
      </el-card>
   </div>
</template>

<script>
    export default {
        name: "Operation",

        data(){

            var checkMobile = (rule,value,callback) => {
                // 验证手机的正则表达式
                const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
                if (regMobile.test(value)) {
                    // 合法手机号
                    return callback()
                }
                callback(new Error("请输入合法的手机号"))
            };

            return{

                // 提交的创建国内赠票表单
                ticketFormZh: {
                    activityName:'',
                    skuId:'',
                    regionId:'1',
                    channel:'',
                },

                // 提交的创建北美赠票表单
                ticketFormInc: {
                    activityName:'',
                    skuId:'',
                    regionId:'1',
                    channel:'',
                },

                // 国内赠票票列表数据
                ticketsListZh:[],

                // 北美赠票票列表数据
                ticketsListInc:[],

                // 表单验证规则
                ticketsRules:{
                    activityName:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ],
                    skuId: [
                        { required: true, message: '请选择影片名称', trigger: 'change' }
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

                // 北美赠票信息
                getTicketFormInc:{
                    mobile:'',
                    password:'',
                    ticketCode:'',
                },
                // 区域ID
                regionId : '1',

                // 创建票结果
                createTicketDataInc:[],

                // 国内赠票数据
                createTicketDataZh:[],

                // 北美赠票数据
                getTicketDataInc:[],
                //环境列表
                channelList:[
                    {
                        id:'1',
                        channelName:'test',
                    },{
                        id:'2',
                        channelName:'prod',
                    },
                ],


            }
        },
        created(){
            // this.getGoodsInfo();
        },
        methods:{
            getGoodsInfoZh:async function() {
                console.log('获取商品信息')
                const {data:res} = await this.$http.get('user_ch/ticketcreatezh',{params:this.ticketFormZh})
                if (res.code === 0){
                    this.ticketsListZh =  res.data
                }
            },

            getGoodsInfoInc:async function () {
                const {data:res} = await this.$http.get('user_ch/ticketcreateinc',{params:this.ticketFormInc})
                if (res.code === 0){
                    this.ticketsListInc =  res.data
                }

            },

            createTicketClickZh:function() {
                console.log('创建国内赠票')
                this.$refs.ticketFormRefZh.validate(async (valid) => {
                    console.log(this.ticketFormZh)
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }

                    for (var i=0;i< this.ticketsListZh.length;i++) {

                        // 对比获取的信息和用户选择的skuId
                        if (this.ticketsListZh[i].skuId === this.ticketFormZh.skuId) {
                            for (var key in this.ticketsListZh[i]) {
                                this.ticketFormZh[key] = this.ticketsListZh[i][key]
                            }
                            const {data:res} = await this.$http.post('user_ch/ticketcreatezh',this.ticketFormZh)
                            console.log("请求的结果数据"+res)
                            if (res.code !== 0) {
                                return this.$message.error('创建赠票链接失败,'+res.msg)
                            }
                            this.createTicketDataZh = res.data
                            this.createTicketDataZh[0].code = '国内没有四位兑换码'
                            if (this.ticketFormZh.channel === 'test') {
                                this.createTicketDataZh[0].giveCode = "\n" +
                                    "https://h5-test.smartcinema.com.cn/ticket/b2c.html?giveCode=" + this.createTicketDataZh[0].giveCode
                            }else if (this.ticketFormZh.channel === 'prod') {
                                this.createTicketDataZh[0].giveCode = "\n" +
                                    "https://h5.smartcinema.com.cn/ticket/b2c.html?giveCode=" + this.createTicketDataZh[0].giveCode
                            }else {return this.$message.error('没有选择运行环境')}

                            this.$refs.ticketFormRefZh.resetFields()

                            return this.$message.success('创建赠票链接成功')
                        }
                    }

                    this.$message.error('在影片列表没有找到填写的影片skuId')

                    console.log('接下来该请求接口生成票码了')
                });
            },

            createTicketClickInc:function () {
                console.log('点击创建海外')
                this.$refs.ticketFormRefInc.validate(async (valid) => {
                    console.log(this.ticketFormInc)
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }

                    for (var i=0;i< this.ticketsListInc.length;i++) {

                        // 对比获取的信息和用户选择的skuId
                        if (this.ticketsListInc[i].skuId===this.ticketFormInc.skuId) {
                            for (var key in this.ticketsListInc[i]) {
                                this.ticketFormInc[key] = this.ticketsListInc[i][key]
                            }
                            const {data:res} = await this.$http.post('user_ch/ticketcreateinc',this.ticketFormInc)
                            console.log("请求的结果数据"+res)
                            if (res.code !== 0) {
                                return this.$message.error('创建赠票链接失败,'+res.msg)
                            }
                            this.createTicketDataInc = res.data
                            if (this.ticketFormInc.channel === 'test') {
                                this.createTicketDataInc[0].giveCode = "\n" +
                                    "https://h5-aws-us-test.smartcinema.com.cn/ticket-intl-us/index.html?giveCode=" + this.createTicketDataInc[0].giveCode
                                this.createTicketDataInc[0].code = "\n" +
                                    "https://h5-aws-us-test.smartcinema.com.cn/exchange-intl-us/index.html?code=" + this.createTicketDataInc[0].code
                            }else if (this.ticketFormInc.channel === 'prod') {
                                this.createTicketDataInc[0].giveCode = "\n" +
                                    "https://h5-aws-us.smartcinema.com.cn/ticket-intl-us/index.html?giveCode=" + this.createTicketDataInc[0].giveCode
                                this.createTicketDataInc[0].code = "\n" +
                                    "https://h5-aws-us.smartcinema.com.cn/exchange-intl-us/index.html?code=" + this.createTicketDataInc[0].code
                            }else {return this.$message.error('没有选择运行环境')}

                            this.$refs.ticketFormRefInc.resetFields()

                            return this.$message.success('创建赠票链接成功')
                        }
                    }

                    this.$message.error('在影片列表没有找到填写的影片skuId')

                    console.log('接下来该请求接口生成票码了')
                });
            },

            getTicketClickInc:function () {
                console.log('点击赠送按钮')
                this.$refs.getTicketFormRef.validate(async (valid) => {
                    if (!valid) {
                        return this.$message.error('请检查填写信息后提交')
                    }
                    console.log('接下来该请求接口赠票了')
                });
            }
        }

    }
</script>

<style Lang="less" scoped>

  .operation-card {
      margin-top: 20px;
  }

  .el-select .el-input .el-select__caret{
      color: red;
  }

</style>
