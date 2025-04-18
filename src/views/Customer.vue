<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const showNameBox = ref(false)

const handleHome = () => {
    router.push('/cus/home')
}

const handleCart = () => {
    router.push('/cus/cart')
}

const handleTrade = () => {
    router.push('/cus/trade')
}

const handleNameOver = () => {
    showNameBox.value = true
}

const handleNameOut = () => {
    showNameBox.value = false
}

const handleLogoutEvent = () => {
    ElMessageBox.confirm(
        '确定要退出登录吗？',
        '退出',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
        }
    )
    .then(() => {
        router.push('/login')
        localStorage.removeItem('ordersys-user')
        ElMessage({
            type: 'success',
            message: '已退出登录',
        })
    })
    .catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消',
        })
    })
}

</script>

<template>
    <el-affix :offset="0" class="top">
        <div class="customer-head">
            <div class="name-container" @mouseenter="handleNameOver" @mouseleave="handleNameOut">
                <div class="username">哈哈哈哈哈</div>
                <div class="name-box" v-show="showNameBox">
                    <div class="true-name-box">
                        <img style="height: 70px; width: 70px; border-radius: 50%;" src="https://objectstorageapi.hzh.sealos.run/kdubuo6i-sealaf-douumbmxo2-cloud-bin/ordersys/cat1.jpg" alt="">
                        <div style="margin-left: 10px; display: flex; flex-direction: column;">
                            <div style="height: 45px; align-items: center; display: flex; justify-content: center; font-weight: 600; font-size: 18px;">哈哈哈哈哈</div>
                            <div style="display: flex; justify-content: space-between; width: 120px;">
                                <div style="cursor: pointer;">账号管理</div>
                                <div>|</div>
                                <div style="cursor: pointer;" @click="handleLogoutEvent">退出</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="flex: 1;"></div>
            <div class="right">
                <div class="home" @click="handleHome">首页</div>
                <div class="cart" @click="handleCart">购物车</div>
                <div class="trade" @click="handleTrade">我的订单</div>
                <div class="favor">收藏夹</div>
            </div>
        </div>
        
    </el-affix>
    
    <div class="customer-body">
        <router-view></router-view>
    </div>
    <el-backtop :right="0" :bottom="0" />
</template>

<style scoped>

.customer-head {
    display: flex;
    padding: 10px 10px;
    background-color: #b8ebff;
    margin: 10px;
    border-radius: 5px;
    z-index: 2;
}

.customer-body {
    display: flex;
    justify-content: center;
    align-items: center;
}

.name-container {
    position: relative;
}

.username {
    z-index: 2;
    cursor: pointer;
}

.right {
    display: flex;
}

.cart {
    margin: 0 10px;
    cursor: pointer;
}

.trade {
    margin: 0 10px;
    cursor: pointer;
}

.home {
    margin: 0 10px;
    cursor: pointer;
}

.favor {
    margin: 0 10px;
    cursor: pointer;
}

.name-box {
    width: 200px;
    height: 100px;
    position: absolute;
    /* border: 1px solid #b8ebff; */
    margin: 0 20px;
    top: 20px;
    left: -20px;
    z-index: 999;
}

.true-name-box {
    width: 200px;
    height: 80px;
    margin-top: 20px;
    background-color: #eaf7fd;
    border-radius: 10px;
    display: flex;
    padding: 15px;
    
}
</style>