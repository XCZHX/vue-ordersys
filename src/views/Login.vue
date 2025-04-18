<script setup>
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')
const activeName = ref('login')

//if(localStorage.getItem('ordersys-user')) router.push('/home')

// ---登录表单相关---
const data = reactive({
    form: { role: 'ADMIN' },
    rules: { //表单规则
        username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
        ],
    },
})

const formRef = ref()

//点击登录校验表单并调用后台登录
const login = () => {
    formRef.value.validate((valid => {
        if(valid) {
            // 调用后台接口代码
            request.post('/login', data.form).then(res => {
                if(res.code === 200) {
                    ElMessage.success('登录成功')
                    if(res.data.role === 'ADMIN') router.push('/')
                    else if(res.data.role === 'USER') router.push('/shop')
                    else router.push('/cus')
                    localStorage.setItem('ordersys-user', JSON.stringify(res.data))
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })).catch(error => {
        console.error(error)
    })
}

// ---注册表单相关---
const validatePass = (rule, value, callback) => {
    if(!value) {
        callback(new Error('请再次输入密码'))
    }else if(value !== data1.form.password) {
        callback(new Error('请确认两次输入密码一致'))
    }else {
        callback()
    }
}

const data1 = reactive({
    form: {},
    rules: { //表单规则
        username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        confirmPassword: [
            { validator: validatePass, trigger: 'blur' },
        ],
    },
})

const formRef1 = ref()

//点击注册校验表单并调用后台注册
const register = () => {
    formRef1.value.validate((valid => {
        if(valid) {
            // 调用后台接口代码
            request.post('/register', data1.form).then(res => {
                if(res.code === 201) {
                    ElMessage.success('注册成功')
                    router.push('/login')
                    //window.location.reload()
                    //localStorage.setItem('ordersys-user', JSON.stringify(res.data))
                } else {
                    ElMessage.error(res.msg)
                }
            })
        }
    })).catch(error => {
        console.error(error)
    })
}

const handleShortcut = (event) => {
    if(event.key === 'Enter'){
        // console.log('111')
        login()
    }
}

</script>

<template>
<div class="login-container" v-on:keydown="handleShortcut">
    <img class="login-icon" src="@/assets/imgs/main-icon.svg" alt="">
    <div class="login-box">
        <el-tabs v-model="activeName" class="login-tabs">
            <el-tab-pane label="登 录" name="login">
                <el-form :model="data.form" ref="formRef" :rules="data.rules">
                    <el-form-item prop="username">
                        <el-input size="large" :prefix-icon="User" v-model="data.form.username" placeholder="请输入账号" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="large" :prefix-icon="Lock" v-model="data.form.password" placeholder="请输入密码" show-password />
                    </el-form-item>
                    <el-form-item prop="role">
                        <el-select v-model="data.form.role">
                            <el-option value="ADMIN" label="管理员"></el-option>
                            <el-option value="USER" label="商家"></el-option>
                            <el-option value="CUS" label="用户"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-button" size="large" @click="login" type="primary">登 录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="注 册" name="register">
                <el-form :model="data1.form" ref="formRef1" :rules="data1.rules">
                    <el-form-item prop="username">
                        <el-input size="large" :prefix-icon="User" v-model="data1.form.username" placeholder="请输入账号" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="large" :prefix-icon="Lock" v-model="data1.form.password" placeholder="请输入密码" show-password />
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input size="large" :prefix-icon="Lock" v-model="data1.form.confirmPassword" placeholder="请确认密码" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-button" size="large" @click="register" type="primary">立 即 注 册</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        
    </div>
</div>
</template>

<style scoped>


.login-container{
    display: flex;
    height: 100vh;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        to top right, 
        #42a5f5,  /* 蓝色 */
        #ffffff   /* 白色 */
    );
    flex-direction: column;
}

.login-icon {
    width: 350px;
    height: auto;
    position: relative;
    bottom: 300px;
}

.login-box {
    width: 350px;
    padding: 40px 30px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    background-color: rgba(255,255,255,.7);
    position: absolute;
    /* font-family:'DingTalk-JinBuTi'; */
}

.el-form {
    margin: 20px 0;
}

.login-box .el-form-item {
    margin-bottom: 25px;
}

.el-select {
    width: 100%;
    height: 40px !important;
}

::v-deep(.el-select__wrapper) {
    min-height: 40px;
}

.login-button {
    margin-top: 15px;
    width: 100%;
    /* font-family: 'DingTalk-JinBuTi'; */
    font-size: 20px;
}

/* 深度选择器（穿透组件样式封装） */
::v-deep(.el-tabs__item) {
  font-size: 20px;
}
</style>

