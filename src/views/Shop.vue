<script setup>

import { House, Edit, User, SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')
const userAvatar = user.avatar?user.avatar:'@/assets/imgs/avatar.png'

// if(!localStorage.getItem('ordersys-user')) router.push('/login')
//console.log(localStorage.getItem('ordersys-user'))

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
<div>
    <div class="manager-header">
        <img class="header-icon" src="@/assets/imgs/main-icon.svg" alt="">
        <div class="header-title">商家平台</div>
        <div class="user-name">{{ user.name }}</div>
        <img class="avatar" :src="userAvatar" alt="">
    </div>
    
    <div class="manager-main">
        <el-menu :default-active="$route.path" class="manager-menu" router>
            <el-menu-item index="/shop">
                <el-icon><House /></el-icon>
                <span>系统首页</span>
            </el-menu-item>
            <el-sub-menu index="2">
                <template #title>
                    <el-icon><Edit /></el-icon>
                    <span>商品订单管理</span>
                </template>
                <el-menu-item index="/shop/seller">商品信息</el-menu-item>
                <el-menu-item index="/shop/trade">订单信息</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/shop/self">
                <el-icon><User /></el-icon>
                <span>店铺资料</span>
            </el-menu-item>
            <el-menu-item @click="handleLogoutEvent">
                <el-icon><SwitchButton /></el-icon>
                <span>退出</span>
            </el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
    
    <div class="manager-footer">
        <div>© 2025 在线购物平台 czh版权所有</div>
    </div>
</div>
</template>

<style scoped>
.manager-header {
    height: 60px;
    display: flex;
    width: 100%;
    align-items: center;
    background: linear-gradient(
        to top, 
        #94cfff,  /* 蓝色 */
        #ecf7ff   /* 白色 */
    );
    /* border-bottom: 2px solid rgba(83, 83, 83, 0.8) */
}

.header-icon {
    width: 100px;
    height: auto;
    margin: 0 20px;
}

.header-title {
    width: 100%;
    font-size: 23px;
    color: #000000;
}

.user-name {
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
    margin: 10px;
    text-align: right;
}

.avatar {
    width: 35px;
    height: auto;
    border-radius: 50%;
    margin: 10px;
}

.manager-main {
    display: flex;
    width: 100%;
    background-color: rgb(243, 243, 243);
    min-height: 900px;
}

.manager-menu {
    width: 230px;
}

.manager-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
}
</style>
