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
      <div style="width: 100%;height: 100%;">
        <div id="main4" style="width: 1000px;height:600px;"></div>
        <div id="3" style="width: 100%;height:30px;"></div>
        <div id="main3" style="width: 800px;height:400px;"></div>
        <div id="2" style="width: 100%;height:30px;"></div>
        <div id="main2" style="width: 800px;height:400px;"></div>
        <div id="1" style="width: 100%;height:30px;"></div>
        <div id="main" style="width: 800px;height:400px;"></div>
        <div id="0" style="width: 100%;height:30px;"></div>
      </div>

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

            var myChart3 = echarts.init(document.getElementById('main3'), 'light');
            var option3 = {
                title: {
                    text: '折线图堆叠'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };

            myChart3.setOption(option3);


            var myChart4 = echarts.init(document.getElementById('main4'), 'light');
            var option4 = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],
                        label: {
                            position: 'inner',
                            fontSize: 14,
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 1548, name: '搜索引擎'},
                            {value: 775, name: '直达'},
                            {value: 679, name: '营销广告', selected: true}
                        ]
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['45%', '60%'],
                        labelLine: {
                            length: 30,
                        },
                        label: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#F6F8FC',
                            borderColor: '#8C8D8E',
                            borderWidth: 1,
                            borderRadius: 4,

                            rich: {
                                a: {
                                    color: '#6E7079',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#8C8D8E',
                                    width: '100%',
                                    borderWidth: 1,
                                    height: 0
                                },
                                b: {
                                    color: '#4C5058',
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#fff',
                                    backgroundColor: '#4C5058',
                                    padding: [3, 4],
                                    borderRadius: 4
                                }
                            }
                        },
                        data: [
                            {value: 1048, name: '百度'},
                            {value: 335, name: '直达'},
                            {value: 310, name: '邮件营销'},
                            {value: 251, name: '谷歌'},
                            {value: 234, name: '联盟广告'},
                            {value: 147, name: '必应'},
                            {value: 135, name: '视频广告'},
                            {value: 102, name: '其他'}
                        ]
                    }
                ]
            };

            myChart4.setOption(option4);


        },
        // methods() {},
    }



</script>



<style Lang="less" scoped>

</style>
