<script setup>
import { ref, reactive, watch } from 'vue'
import request from '@/utils/request'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Close, Plus, ZoomIn, Delete} from '@element-plus/icons-vue'

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')
const router = useRouter()

const tableData = ref([])
const getData = ref({
    condition: '',
    shopId: user._id,
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
const addClass = ref('')
const newClass = ref([])
const picPreviewVisible = ref(false)
const newImageUrl = ref('')
const picList = ref([])

watch(addDialogFormVisible, (New) => {
    if(!New){
        // addForm.value = {}
        // router.go(0)
    }
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
    getSeller()
}

const handleAvatarRemove = (file, uploadFiles) => {
    //console.log(file.name)
    deletefile(file.name)
    delete updateForm.value.avatar
}

const handleAvatarExceed = (files, uploadFiles) => {
  ElMessage.warning('只能上传一张图片！')
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
    // getfileurl(uploadFile.name).then(() => {
    //     console.log(addForm.value)
    // })
    getfileurl(uploadFile.name)
}

const handleAvatarProgress = (event, uploadFile, uploadFiles) => {
    // addForm.value.img = uploadFile.name
}

const openImg = (url) => {
    window.open(url)
}

function getSeller(){
    request.post('/seller_select_page', getData.value).then(res => {
        if(res.code === 200) {
            tableData.value = res.data
            getData.value.paginationData.total = res.total
        } else {
            ElMessage.error('查询失败')
        }
    })
}

getSeller()

const picConfirm = () => {
    picList.value.submit()
    // ElMessage.success('图片上传成功')
}

function addSeller(){
    if(newClass.value.length === 0){
        ElMessage.error('至少需要一个商品分类')
        return
    }
    if(!addForm.value.img){
        ElMessage.error('商品图片未上传')
        return
    }
    addForm.value.sClass = JSON.parse(JSON.stringify(newClass.value))
    addForm.value.price = parseFloat(addForm.value.price)*100
    addForm.value.shopId = user._id
    // console.log(addForm.value)
    request.post('/seller_add', addForm.value ).then(res => {
        //console.log(res)
        if(res.code === 200) {
            ElMessage.success(res.msg)
            getSeller()
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
    getSeller()
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
        '确定要删除这个商品吗?',
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
    getSeller()
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
            // console.log(res.url)
            //ElMessage.success(res.msg)
            // updateForm.value.avatar = res.url
            addForm.value.img = res.url
        } else {
            ElMessage.error(res.msg)
        }
    })
}

const handleShortcut = (event) => {
    if(event.key === 'Enter' && addClass.value != ''){
        if(newClass.value.indexOf(addClass.value) === -1){
            newClass.value.push(addClass.value)
        }else{
            ElMessage.error('重复输入')
        }
        
        // console.log(newClass.value)
    }
}

const deleteClass = (item) => {
    newClass.value.splice(newClass.value.indexOf(item),1)
}

const handlePicPreview = (file) => {
    newImageUrl.value = file.url
    picPreviewVisible.value = true
}

const handlePicRemove = (file) => {
    picList.value.handleRemove(file)
    // console.log(picList.value)
}
</script>

<template>
<div class="admin-container">
    <div class="card search-box" :model="getData">
        <el-input :disabled="!searchButton" class="search-input" v-model="getData.condition" placeholder="请输入商品名称" :prefix-icon="Search"/>
        <el-button @click="searchByCondition" :type="searchButton?'primary':'danger'">{{ searchButton?"查询":"重置" }}</el-button>
    </div>
    <div class="card display-box">
        <div class="button-line">
            <el-button type="primary" @click="addDialogFormVisible = true">新增</el-button>
            <el-button v-if="false" :disabled="!multipleSelection.length && deleteManyButton" type="danger" @click="deleteMany">{{ deleteManyButton?"确认删除":"批量删除" }}</el-button>
            <el-button v-show="deleteManyButton" @click="deleteManyButton=!deleteManyButton">取消批量删除</el-button>
        </div>
        <el-table empty-text="无结果" layout="auto" class="admin-table" :data="tableData" @selection-change="handleSelectionChange" ref="multipleTableRef">
            <el-table-column type="index" v-if="!deleteManyButton"/>
            <el-table-column type="selection" prop="selection"  v-else/>
            <el-table-column prop="_id" label="商品编号"/>
            <el-table-column prop="title" label="商品名称"/>
            <el-table-column prop="price" label="价格">
                <template #default="scope">
                    <div>￥{{ scope.row.price/100 }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="sClass" label="分类" v-if="false" width="0"/>
            <el-table-column prop="img" label="图片">
                <template #default="scope">
                    <img class="seller-img" :src="scope.row.img" v-if="scope.row.img" @click="openImg(scope.row.img)"></img>
                </template>
            </el-table-column>
            <el-table-column fixed="right" prop="operation" label="操作" width="135">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="updateOne(scope.row)">编辑</el-button>
                    <el-button disabled type="danger" size="small" @click="deleteOne(scope.row._id, scope.row.username)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box" :model="getData.paginationData">
            <el-pagination layout="prev, pager, next" @current-change="handlePageCurrentChange" :page-size="getData.paginationData.pageSize" :total="getData.paginationData.total" />
        </div>
    </div>
</div>

<el-dialog width="450px" v-model="addDialogFormVisible" title="新增商品">
    <el-form v-model="addForm">
    <el-form-item label="商品名称">
        <el-input v-model="addForm.title" placeholder="请输入商品名称"/>
    </el-form-item>
    <el-form-item label="商品价格">
        <el-input v-model="addForm.price" placeholder="请输入价格"/>
    </el-form-item>
    <el-form-item label="商品分类">
        <div class="class-box" :model="addForm.sClass">
            <div class="class-tags">
                <div class="class-tag" v-for="item of newClass" :key="item">
                    <div>{{ item }}</div>
                    <el-icon style="margin-left: 3px; cursor: pointer;" @click="deleteClass(item)"><Close /></el-icon>
                </div>
            </div>
            <input v-model="addClass" class="class-input" placeholder="输入商品分类名称，回车键创建分类" v-on:keydown="handleShortcut"/>
        </div>
    </el-form-item>
    <el-form-item label="图片" v-if="false">
        <input v-model="addForm.img"/>
    </el-form-item>
    <el-form-item lable="商品图片">
        <div style="margin-right: 20px;">商品图片</div>
        <el-upload
            ref="picList"
            action="https://douumbmxo2.hzh.sealos.run/file_upload"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
            accept=".jpg,.png"
            :on-exceed="handleAvatarExceed"
            :on-success="handleAvatarSuccess"
            :on-progress="handleAvatarProgress"
        >
            <el-icon><Plus /></el-icon>
            <template #file="{ file }">
            <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePicPreview(file)">
                    <el-icon><Zoom-in /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handlePicRemove(file)">
                    <el-icon><Delete /></el-icon>
                </span>
                </span>
            </div>
            </template>
        </el-upload>
    </el-form-item>
    <div style="display: flex; align-items: center;">
        <div style="margin-left: 80px;">{{addForm.img?'已上传':'未上传'}}</div>
        <el-button style="margin-left: 25px;" @click="picConfirm">确认上传</el-button>
    </div>
    
    <el-dialog v-model="picPreviewVisible">
        <img w-full :src="newImageUrl" alt="Preview Image" />
    </el-dialog>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="addDialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addSeller">确认</el-button>
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

.seller-img {
    width: 90px;
    height: 90px;
}

.class-box {
    border: 1px solid #cacaca;
    width: 350px;
    border-radius: 5px;
}

.class-tags {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
}

.class-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: #409EFF;
    color: #FFF;
    margin: 3px 2px;
    padding: 0 10px;
    white-space: nowrap;
}

.class-input {
    border: none;
    box-shadow: none;
    outline: none;
    width: 95%;
    margin: 0 5px;
    font-size: 15px;
}
</style>