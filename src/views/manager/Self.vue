<script setup>
import { ref, watch } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const userData = ref({})
const userDataNew = ref({})
userData.value = JSON.parse(JSON.stringify(user) || '{}')
userDataNew.value = JSON.parse(JSON.stringify(user) || '{}')

const nameEditButton = ref(false)
const isSetName = ref(false)
const isflash = ref(false)

watch(isflash, (New) => {
    if(New) router.go(0)
})

function updateandFlash() {
    const loginData = {
        username: userData.value.username,
        password: userData.value.password,
        role: userData.value.role
    }
    request.post('/login', loginData).then(res1 => {
        if(res1.code === 200) {
            localStorage.setItem('ordersys-user', JSON.stringify(res1.data))
            isflash.value = true
        } else {
            ElMessage.error(res1.msg)
        }
    })
}

function nameEdit() {
    if(userData.value.name === userDataNew.value.name){
        // ElMessage.error('没有修改')
        return
    }
    const nameData = ref({
        id: userData.value._id,
        key: 'name',
        value: userDataNew.value.name,
        role: 'ADMIN'
    })
    request.post('/self_update', nameData.value).then(res => {
        if(res.code === 200) {
            ElMessage.success(res.msg)
            updateandFlash()
        } else {
            ElMessage.error('更新失败')
            console.log(res)
        }
    })
}

const handleNameFocus = () => {
    nameEditButton.value = true
}

</script>

<template>
<div class="self-container">
    <div class="card display-box">
        <el-button class="nameButton" v-show="!isSetName" @click="isSetName=true">编辑</el-button>
        <el-button class="nameButton" type="danger" v-show="isSetName" @click="isSetName=false">完成</el-button>
        <el-form :model="userData" label-width="120px">
            <el-avatar size="default" :src="userData.avatar"></el-avatar>
            <el-form-item label="头像" v-if="false">
                <el-input v-model="userData.avatar" />
            </el-form-item>
            <el-form-item label="账号">
                <div>{{ userData.username }}</div>
            </el-form-item>
            <el-form-item label="名称" v-show="!isSetName">
                <div>{{ userData.name }}</div>
                
            </el-form-item>
            <el-form-item label="名称" v-show="isSetName">
                <el-input v-model="userDataNew.name" :placeholder="user.name"/>
                <el-button class="nameButton" type="primary" @click="nameEdit">确认</el-button>
                
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="userData.password" type="password" disabled/>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<style scoped>
.self-container {
    min-width: 500px;
    width: 100%;
}

.card {
    /* border: 1px solid #000; */
    margin: 10px 20px;
    padding: 10px;
    display: flex;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    background-color: #FFF;
}

.display-box {
    flex-direction: column;
    width: 760px;
}

.el-input {
    width: 400px;
}

.el-avatar {
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 100px;
    width: 100px;
    height: auto;
}

.nameButton {
    margin-left: 5px;
    width: 100px;
}
</style>