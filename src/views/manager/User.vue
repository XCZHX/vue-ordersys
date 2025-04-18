<script setup>
import { ref, watch } from 'vue'
import request from '@/utils/request'
import { ElMessage, formatter } from 'element-plus';
import { Search} from '@element-plus/icons-vue'
import { fa } from 'element-plus/es/locales.mjs';

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
    request.post('/user_select_page', getData.value).then(res => {
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

function searchByCondition(){
    if(getData.value.condition == '') return
    searchButton.value=!searchButton.value
    if(searchButton.value == true) getData.value.condition = ''
    getAdmin()
}

</script>

<template>
<div class="admin-container">
    <div class="card search-box" :model="getData">
        <el-input :disabled="!searchButton" class="search-input" v-model="getData.condition" placeholder="请输入账号或名称查询" :prefix-icon="Search"/>
        <el-button @click="searchByCondition" :type="searchButton?'primary':'danger'">{{ searchButton?"查询":"重置" }}</el-button>
    </div>
    <div class="card display-box">
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
            <el-table-column prop="phone" label="联系方式"/>
        </el-table>
        <div class="pagination-box" :model="getData.paginationData">
            <el-pagination layout="prev, pager, next" @current-change="handlePageCurrentChange" :page-size="getData.paginationData.pageSize" :total="getData.paginationData.total" />
        </div>
    </div>
</div>
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