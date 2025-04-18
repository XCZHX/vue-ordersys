<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const t = ref(3)
const router = useRouter()

function countdown(duration, onEnd) {
    let timer = duration
    const interval = 1000

    const timeId = setInterval(() => {
        t.value--
        timer--
        if(timer==0) {
            clearInterval(timeId)
            onEnd()
        }
    }, interval)
}

countdown(3, () => {
    router.push('/login')
})

</script>

<template>
    <div class="notFound-body">
        <div>您输入了错误的网址或没有相关权限！</div>
        <div>{{ t }} 秒后返回主页</div>
    </div>
</template>

<style scoped>
.notFound-body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
}
</style>