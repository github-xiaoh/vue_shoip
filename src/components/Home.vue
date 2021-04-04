<template>
    <div>
        <h3 style="text-align: center">Home 组件</h3>
        <el-button type="primary" @click="logout">退出登录</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        methods:{
            logout:function () {
                window.sessionStorage.clear()
                this.$router.push('/logout')
            }
        }
    }
</script>

<style scoped>

</style>
