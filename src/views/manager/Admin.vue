<script setup>
import { ref, reactive, watch } from 'vue'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const tableData = ref([])
const getData = ref({
    condition: '',
    paginationData: {
        pageSize: 10,
        pageIndex: 1,
        total: 100,
    }
})

const addForm = ref({})
const updateForm = ref({})
const now = ref({})
const deleteManyButton = ref(false)
const searchButton = ref(true)
const addDialogFormVisible = ref(false)
const multipleSelection = ref([])
const multipleTableRef = ref()
const updateDialogFormVisible = ref(false)
const fileList = ref([])
const updateboxkey = ref(0)
const defaultAvatar = ref('@/assets/imgs/avatar.png')

watch(addDialogFormVisible, (New) => {
    if(!New) addForm.value = {}
})


watch(updateDialogFormVisible, (New) => {
    if(!New){
        updateForm.value = {}
        updateboxkey.value++
    }
})

watch(deleteManyButton, (New) => {
    if(!New) multipleTableRef.value.clearSelection()
})

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const handlePageCurrentChange = (val) => {
    getData.value.paginationData.pageIndex = val
    getAdmin()
}

const handleAvatarRemove = (file, uploadFiles) => {
    //console.log(file.name)
    deletefile(file.name)
    delete updateForm.value.avatar
}

const handleAvatarExceed = (files, uploadFiles) => {
  ElMessage.warning('只能上传一个文件！')
}

const beforeAvatarUpload = (uploadFile) => {
  const isLt500KB = uploadFile.size / 1024 / 1024 < 0.5;
  if(!isLt500KB) {
    ElMessage.warning('文件大小超过了500KB！')
    return false
  }
  return true
}

const handleAvatarSuccess = (response, uploadFile, uploadFiles) => {
  getfileurl(uploadFile.name)
  //console.log(updateForm.value)
  //console.log(now.value)
}

function getAdmin(){
    // request.get('/admin_select_all').then(res => {
    //     //console.log(res)
    //     if(res.code === 200) {
    //         //ElMessage.success(res.msg)
    //         tableData.value = res.data
    //     } else {
    //         ElMessage.error('查询失败')
    //     }
    // })
    request.post('/admin_select_page', getData.value).then(res => {
        //console.log(res)
        if(res.code === 200) {
            //ElMessage.success(res.msg)
            tableData.value = res.data
            getData.value.paginationData.total = res.total
            //console.log(res)
        } else {
            ElMessage.error('查询失败')
        }
    })
}

getAdmin()

function addAdmin(){
    request.post('/admin_add', addForm.value ).then(res => {
        //console.log(res)
        if(res.code === 200) {
            ElMessage.success(res.msg)
            getAdmin()
        } else {
            ElMessage.error(res.msg)
        }
    })
    addDialogFormVisible.value = false
}

function updateAdmin(){
    if(updateForm.value.username === now.value.username) delete updateForm.value['username'];
    if(updateForm.value.name === now.value.name) delete updateForm.value['name'];
    if(updateForm.value.password === now.value.password) delete updateForm.value['password'];
    if(updateForm.value.avatar === now.value.avatar) delete updateForm.value['avatar'];
    //console.log(updateForm.value)
    request.post('/admin_update', updateForm.value ).then(res => {
        //console.log(res)
        if(res.code === 200) {
            ElMessage.success(res.msg)
            
        } else {
            ElMessage.error(res.msg)
        }
    })
    getAdmin()
    updateDialogFormVisible.value = false
}

function updateOne(data){
    updateForm.value.username = data.username
    updateForm.value.id = data._id
    updateForm.value.name = data.name
    updateForm.value.password = data.password
    updateForm.value.avatar = data.avatar
    now.value = data
    updateDialogFormVisible.value = true
}

const deleteOne = (id, username) => {
    ElMessageBox.confirm(
        '确定要删除这个账号吗?',
        '删除账号 '+username,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(() => {
        request.post('/admin_delete', { id: id } ).then(res => {
            //console.log(res)
            if(res.code === 200) {
                ElMessage.success(res.msg)
                getAdmin()
            } else {
                ElMessage.error(res.msg)
            }
        })
    })
    .catch(() => {
        ElMessage({
            type: 'info',
            message: '取消删除',
      })
    })
}

function deleteMany(){
    const data = {
        idList: multipleSelection.value.map(data => data._id)
    }
    if(deleteManyButton.value === true) {
        ElMessageBox.confirm(
            '确定要删除这些账号吗?',
            '批量删除账号',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        .then(() => {
            //console.log(data)
            request.post('/admin_delete_many', data).then(res => {
                //console.log(res)
                if(res.code === 200) {
                    ElMessage.success(res.msg)
                    getAdmin()
                } else {
                    ElMessage.error(res.msg)
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })   
    }
    deleteManyButton.value=!deleteManyButton.value
}

function searchByCondition(){
    if(getData.value.condition == '') return
    searchButton.value=!searchButton.value
    if(searchButton.value == true) getData.value.condition = ''
    getAdmin()
}

function deletefile(filename){
    request.post('/file_delete', { name: filename } ).then(res => {
        // if(res.code === 200) {
        //     ElMessage.success(res.msg)
        // } else {
        //     ElMessage.error(res.msg)
        // }
    })
}

function getfileurl(filename){
    request.post('/file_download', { name: filename } ).then(res => {
        if(res.code === 200) {
            //ElMessage.success(res.msg)
            updateForm.value.avatar = res.url
        } else {
            ElMessage.error(res.msg)
        }
    })
}
</script>

<template>
<div class="admin-container">
    <div class="card search-box" :model="getData">
        <el-input :disabled="!searchButton" class="search-input" v-model="getData.condition" placeholder="请输入账号或名称查询" :prefix-icon="Search"/>
        <el-button @click="searchByCondition" :type="searchButton?'primary':'danger'">{{ searchButton?"查询":"重置" }}</el-button>
    </div>
    <div class="card display-box">
        <div class="button-line">
            <el-button type="primary" @click="addDialogFormVisible = true">新增</el-button>
            <el-button :disabled="!multipleSelection.length && deleteManyButton" type="danger" @click="deleteMany">{{ deleteManyButton?"确认删除":"批量删除" }}</el-button>
            <el-button v-show="deleteManyButton" @click="deleteManyButton=!deleteManyButton">取消批量删除</el-button>
        </div>
        <el-table empty-text="无结果" layout="auto" class="admin-table" :data="tableData" @selection-change="handleSelectionChange" ref="multipleTableRef">
            <el-table-column type="index" v-if="!deleteManyButton"/>
            <el-table-column type="selection" prop="selection"  v-else/>
            <el-table-column prop="id" label="_id" width="0" v-if="false"/>
            <el-table-column prop="username" label="账号"/>
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="avatar" label="头像">
                <template #default="scope">
                    <el-avatar size="default" :src="scope.row.avatar" v-if="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column fixed="right" prop="operation" label="操作" width="135">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="updateOne(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteOne(scope.row._id, scope.row.username)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box" :model="getData.paginationData">
            <el-pagination layout="prev, pager, next" @current-change="handlePageCurrentChange" :page-size="getData.paginationData.pageSize" :total="getData.paginationData.total" />
        </div>
    </div>
</div>

<el-dialog width="450px" v-model="addDialogFormVisible" title="新增管理员账号">
    <el-form :model="addForm">
    <el-form-item label="账号">
        <el-input v-model="addForm.username" placeholder="请输入账号"/>
    </el-form-item>
    <el-form-item label="密码">
        <el-input v-model="addForm.password" placeholder="请输入密码，默认为Admin">
        </el-input>
    </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addAdmin">确认</el-button>
    </span>
    </template>
</el-dialog>

<el-dialog :key="updateboxkey" width="450px" v-model="updateDialogFormVisible" title="编辑管理员账号">
    <el-form :model="updateForm">
    <el-form-item label="账号">
        <el-input v-model="updateForm.username" :placeholder="now.username" disabled/>
    </el-form-item>
    <el-form-item label="密码">
        <el-input v-model="updateForm.password" :placeholder="now.password">
        </el-input>
    </el-form-item>
    <el-form-item label="名称">
        <el-input v-model="updateForm.name" :placeholder="now.name">
        </el-input>
    </el-form-item>
    <el-form-item label="头像地址" v-show="false">
        <el-input v-model="updateForm.avatar" :placeholder="now.avatar" disabled>
        </el-input>
    </el-form-item>
    <el-form-item label="头像">
        <el-upload
            ref="fileList"
            class="avatar-upload"
            action="https://douumbmxo2.hzh.sealos.run/file_upload"
            accept=".jpg,.png"
            :on-remove="handleAvatarRemove"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleAvatarExceed"
            :on-success="handleAvatarSuccess"
            >
            <el-button type="primary">点击上传头像</el-button>
            <template #tip>
                <div class="el-upload__tip">文件格式：jpg/png 文件大小：小于500KB</div>
            </template>
        </el-upload>
    </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
        <el-button @click="updateDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateAdmin">确认</el-button>
    </span>
    </template>
</el-dialog>
</template>

<style scoped>
.admin-container {
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

.search-input {
    width: 350px;
    margin: 0 10px
}

.search-box .el-button {
    margin: 0 5px;
}

.display-box {
    flex-direction: column;
}

.admin-table {
    width: 100%;
}

::v-deep(.el-table__empty-text) {
    font-size: 25px;
}
</style>