module.exports = {
    // 自定义配置
    chainWebpack:config => {

        // 发布main文件
        config.when(process.env.NODE_ENV === 'production',config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals',{
                vue:'Vue',
                'vue-router': 'VueRouter',
                axios:'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress:'NProgress',
                // 'vue-quill-editor':'VueQuillEditor'
            })

            // 定制化首页内容，通过 isprod 参数 ,index.html 文件中判断
            config.plugin('html').tap(args => {
                args[0].isprod = true
                return args
            })
        })

        // 开发main文件
        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main-dev.js')

            // 定制化首页内容，通过 isprod 参数 ,index.html 文件中判断
            config.plugin('html').tap(args => {
                    args[0].isprod = false
                    console.log('args:'+args)
                    return args
            })
        })
    }
}
