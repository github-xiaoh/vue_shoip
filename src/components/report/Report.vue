<template>
  <div>

    <!--面包屑区域-->
    <template>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <!--卡片内容区域-->
    <el-card class="box-card" >
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px;height:400px;"></div>
      <div id="main1" style="width: 600px;height:30px;"></div>
      <div id="main2" style="width: 600px;height:400px;"></div>
    </el-card>



  </div>
</template>

<script>
    // src="https://lib.baomitu.com/echarts/5.1.0/echarts.common.min.js">
    // 1、导入Echarts
    import echarts from 'echarts'
    import _ from 'lodash'

    export default {
        name: "Report",
        data() {
            return {

                // 需要合并的数据，不合并直接使用服务端数据，没有鼠标跟随效果
                options : {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    xAxis: [{boundaryGap: false}],
                    yAxis: [{type: 'value'}],
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    }
                }
            }
        },
        created() {},
        async mounted() {
            // 2、在页面数据 以及 Dom加载完成后执行，初始化 echarts 实例
            // 基于准备好的dom，初始化echarts实例
            // myChart = echarts.init(document.getElementById('填入页面元素ID值'), '图标的主题显示色彩');
            var myChart = echarts.init(document.getElementById('main'), 'light');
            //
            //
            const {data:res} = await this.$http.get('reports/type/1')
            if (res.meta.status !== 200) {
                return this.$message.error('获取数据失败')
            }
            // 3、准备数据和配置项
            // 指定图表的配置项和数据       注释掉使用服务端返回数据
            // var option = {
            //     title: {
            //         text: 'ECharts 入门示例'
            //     },
            //     tooltip: {},
            //     legend: {
            //         data:['销量']
            //     },
            //     xAxis: {
            //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            //     },
            //     yAxis: {},
            //     series: [{
            //         name: '销量',
            //         type: 'bar',
            //         data: [5, 20, 36, 10, 10, 20]
            //     }]
            // };

            const result =  _.merge(res.data, this.options)

            // 4、 展示数据
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(result);


            var myChart2 = echarts.init(document.getElementById('main2'), 'light');

            var option2 = {
                title: {
                    text: '未来一周气温变化',
                    subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['最高气温', '最低气温']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                },
                series: [
                    {
                        name: '最高气温',
                        type: 'line',
                        data: [10, 11, 13, 11, 12, 12, 9],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name: '最低气温',
                        type: 'line',
                        data: [1, -2, 2, 5, 3, 2, 0],
                        markPoint: {
                            data: [
                                {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        position: 'start',
                                        formatter: '最大值'
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }
                    }
                ]
            };

            myChart2.setOption(option2);



        },
        // methods() {},
    }



</script>



<style Lang="less" scoped>

</style>
