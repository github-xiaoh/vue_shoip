<template>
    <div>

      <!--内嵌html文件-->
      <template>
        <div style="width: 100%;height: 900px">
          <!--<el-button @click="openHtml">打开</el-button>-->
          <!--<iframe src="requort2.html" frameborder="0" style="height: 100%;width: 100%"></iframe>-->
          <iframe ref="iframeRef" scrolling="auto" width="100%" height="100%" frameborder="0" :src="url" ></iframe>
        </div>
      </template>

    </div>
</template>

<script>
    export default {
        name: "ReportTemplate",
        data() {
            return {
                url:'static/requort.html',
            }
        },
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
