<script setup>
import { ref } from 'vue';
import request from '@/utils/request'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Base64 } from 'js-base64';

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')
const router = useRouter()

const cartData = ref([])

// const cusId = ref({
//     id: user._id
// })

const chosenData = ref([
])

const tableRef = ref()

const multipleSelection = ref()
const sumPrice = ref(0)

function getCart(){
    request.post('/select_cart_byId', {id: user._id}).then(res => {
        if(res.code === 200) {
            cartData.value = res.cart
        } else {
            ElMessage.error(res.msg)
        }
    })
}

const handleSelectionChange = (val) => {
    multipleSelection.value = val
    chosenData.value = []
    sumPrice.value = 0
    for(let i of multipleSelection.value){
        chosenData.value.push(
            {
                sellerId: i.sellerId,
                sellerPrice: i.sellerPrice,
                sellerImg: i.sellerImg,
                sellerCount: i.sellerCount,
                sellerClass: i.sellerClass,
                sellerTitle: i.sellerTitle,
                shopId: i.shopId,
                shopName: i.shopName
            }
        )
        sumPrice.value += i.sellerPrice*i.sellerCount
    }
}

const handleNumberChange = () => {
    if(multipleSelection.value){
        chosenData.value = []
        sumPrice.value = 0
        for(let i of multipleSelection.value){
            chosenData.value.push(
                {
                    sellerId: i.sellerId,
                    sellerPrice: i.sellerPrice,
                    sellerImg: i.sellerImg,
                    sellerCount: i.sellerCount,
                    sellerClass: i.sellerClass,
                    sellerTitle: i.sellerTitle,
                    shopId: i.shopId,
                    shopName: i.shopName
                }
            )
            sumPrice.value += i.sellerPrice*i.sellerCount
        }
    }
}

const handleSubmit = () => {
    if(chosenData.value.length === 0){
        ElMessage.error('未选择商品')
    }else{
        // console.log(chosenData.value)
        router.push(`/cus/order?val=${Base64.encode(JSON.stringify(chosenData.value), true)}`)
    }
}

getCart()
</script>

<template>
    <div class="cart-container">
        <div class="cart-left">
            <div class="cart-title">购物车</div>
            <div class="cart-head">全部商品 ({{ cartData.length }})</div>
            <div class="cart-body">
                <el-button class="delete-button">删除</el-button>
                <el-table
                    class="cart-table"
                    ref="tableRef"
                    :data="cartData"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="" width="120">
                        <template #default="scope">
                            <img style="width: 80px; border-radius: 5px;" :src="scope.row.sellerImg" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column property="sellerTitle" label="" width="270" >
                        <template #default="scope">
                            <div class="seller-title">{{ scope.row.sellerTitle }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column property="sellerClass" label="" width="150" >
                        <template #default="scope">
                            <div class="seller-class">{{ scope.row.sellerClass }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column property="sellerPrice" label="" width="120" >
                        <template #default="scope">
                            <div class="seller-price">￥{{ scope.row.sellerPrice/100 }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="" width="200" >
                        <template #default="scope">
                            <el-input-number v-model="scope.row.sellerCount" :min="1" :max="999" @change="handleNumberChange"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="" width="80" >
                        <template #default="scope">
                            <div>删除</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="cart-right">
            <div class="trade-box card">
                <div class="trade-header">
                    <span style="font-weight: 600;">结算明细</span>
                </div>
                <div class="sum-price">
                    <div class="trade-sellers">
                        <div class="trade-seller" v-for="item in chosenData" :key="item">
                            <img style="width: 60px; border-radius: 8px;" :src="item.sellerImg" alt="">
                        </div>
                    </div>
                    <div style="display: flex;">
                        <span style="flex: 1;">商品总价</span>
                        <span>￥ {{ sumPrice/100 }}</span>
                    </div>
                </div>
                <div class="submit-box">
                    <div class="true-price">
                        <span>合计:</span>
                        <span>￥ {{ sumPrice/100 }}</span>
                    </div>
                    <div class="submit-button" @click="handleSubmit">结算 ({{ chosenData.length }})</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    margin: 20px 0;
    display: flex;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
    background-color: #FFF;
}

.cart-container {
    display: flex;
    justify-content: center;
    min-width: 1500px;
}

.cart-left {
    display: flex;
    flex-direction: column;
    width: 1000px;
    margin: 30px;
}

.cart-right {
    display: flex;
    width: 350px;
}

.trade-box {
    width: 320px;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(
        to bottom,
        #dff9ff,
        #FFF
    ) ;
    position: absolute;
    padding-bottom: 10px;
}

.delete-button {
    position: relative;
    top: 32px;
    left: 50px;
    z-index: 999;
}

.submit-button {
    width: 80%;
    height: 40px;
    background-color: #02B6FD;
    color: #FFF;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;
}

.trade-sellers {
    display: flex;
    flex-wrap: wrap;
}

.trade-seller {
    margin: 5px;
}

.sum-price {
    width: 90%;
    margin: 10px;
    display: flex;
    flex-direction: column;
}

.submit-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.seller-title {
    font-weight: 600;
    color: black;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.seller-class {
    font-size: 12px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.seller-price {
    color: black;
}

.trade-header {
    margin: 10px 15px;
}

.true-price {
    align-self: flex-end;
    margin: 10px 20px;
}
</style>