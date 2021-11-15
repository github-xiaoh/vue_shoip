<template>
    <div>

      <!--内嵌html文件-->
      <template>
        <div style="width: 100%;height: 900px">
          <!--<el-button @click="openHtml">打开</el-button>-->
          <!--<iframe src="requort2.html" frameborder="0" style="height: 100%;width: 100%"></iframe>-->
          <iframe ref="iframeRef" scrolling="auto" width="100%" height="100%" frameborder="0"  :src="url"></iframe>
          <div>
            <a href="http://0.0.0.0:8001/auto_api/case_report_html">查看报告</a>
          </div>
        </div>
      </template>

    </div>
</template>

<script>
    export default {
        name: "ReportTemplate",
        data() {
            return {
                url:'static/report.html',
                caseHtml:'<h3>324243</h3>',
            }
        },
        created(){
            this.getCaseHtml()
        },
        methods:{
            getCaseHtml:async function () {
                const {data:res} = await this.$http.get('auto_api/case_report_html')
                console.log(res)
                this.caseHtml = res

            }
        }
        // watch: {
        //     url(val) {
        //         if (val) {
        //             this.$refs.iframeRef.contentWindow.location.replace(val)
        //         }
        //     }
        // }
    }
</script>

<style scoped>

</style>
