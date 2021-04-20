<template>
    <div>
        <!--<h3>Welcome</h3>-->
        <!--面包屑区域-->
        <template>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>测试平台</el-breadcrumb-item>
            <el-breadcrumb-item>测试首页</el-breadcrumb-item>
          </el-breadcrumb>
        </template>

        <!--卡片内容区域-->
        <el-card class="box-card" >
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "Welcome",
        mounted() {

            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom,'light');

            var option = {
                title: {
                    text: '各模块使用频次'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['用户管理', '权限管理', '测试工具', '运营工具']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '用户管理',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '权限管理',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '测试工具',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '运营工具',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                ]
            };

            // 4、 展示数据
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
    }
</script>

<style scoped>

</style>
