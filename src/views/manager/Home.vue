<script setup>
import { useTransition } from '@vueuse/core'
import { ref } from 'vue'

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const source = ref(0)
const traffic = useTransition(source, {
  duration: 1000,
})
source.value = 172000

</script>

<template>
<div>
    <div class="card welcome">
        <div>欢迎您，{{ user.name }} 祝您今天过得开心！</div>
    </div>
    <div class="card sta-box">
        <div class="sta-item">
            <el-statistic title="管理员" :value="12" />
        </div>
        <div class="sta-item">
            <el-statistic title="用户" :value="4" />
        </div>
        <div class="sta-item">
            <el-statistic title="今日流量" :value="traffic" />
        </div>
    </div>
</div>
</template>

<style scoped>
.card {
    margin: 10px 20px;
    padding: 10px;
    display: flex;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    background-color: #FFF;
}

.welcome {
    width: 300px;
}

.sta-box {
    width: 600px;
}

.sta-item {
    margin: 10px 50px;
}
</style>