<script setup>
import { ref } from 'vue';
import { Location } from '@element-plus/icons-vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios'
import { Base64 } from 'js-base64';

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const router = useRouter();
const route = useRoute()

const orderData = ref({
    customer: {
        id: user._id,
        address: [],
    },
    seller: [] 
})

orderData.value.customer.address = user.address

if(!route.query.val){
    //console.log('没有数据')
    router.push('/NotFound')
}else{
    // getSeller()
    // console.log(JSON.parse(Base64.decode(route.query.val, true)))
    orderData.value.seller = JSON.parse(Base64.decode(route.query.val, true))
}

const isAddress = ref([])

for (let i in orderData.value.customer.address) {
    if(i == 0){
        isAddress.value.push(true)
    }else {
        isAddress.value.push(false)
    }
}

const handleAddressClick = (index) => {
    for (let i in orderData.value.customer.address) {
    if(i == index){
        isAddress.value[i] = true
    }else {
        isAddress.value[i] = false
    }
}
}

const sumPrice = ref(0)
const sumCount = ref(0)

function sumThePrice() {
    sumPrice.value = 0
    for (let item of orderData.value.seller){
        sumPrice.value += item.sellerPrice*item.sellerCount
    }
}

function sumTheCount() {
    sumCount.value = 0
    for (let item of orderData.value.seller){
        sumCount.value ++
    }
}

sumThePrice()
sumTheCount()

const handleCountChange = (curValue, oldValue) => {
    sumThePrice()
    sumTheCount()
}


// ---接入支付宝沙箱---
// const handleSubmit = () => {
//     request.get('/pay').then(res => {
//         window.location.href = res.result
//     })
// }

// request.get('/search_pay').then(res => {
//     axios.get(res.result).then(res1 => {
//         if(res1.data.alipay_trade_query_response.code === '10000') ElMessage.success('支付成功')
//         else ElMessage.error('支付失败')
//     })
// })

const handleSubmit = () => {
    const sellerData = JSON.parse(JSON.stringify(orderData.value.seller))
    while(sellerData.length>0){
        let sum = 0
        const sellers = []
        const sItem = sellerData.shift()
        // console.log('去掉一个还剩'+sellerData.length)
        const shopId = sItem.shopId
        sellers.push({
            id: sItem.sellerId,
            class: sItem.sellerClass,
            count: sItem.sellerCount
        })
        sum = sum + sItem.sellerPrice * sItem.sellerCount

        for (let item of sellerData){
            if(item.shopId === sItem.shopId){
                const ssItem = sellerData.splice(sellerData.indexOf(item),1)[0]
                sellers.push({
                    id: ssItem.sellerId,
                    class: ssItem.sellerClass,
                    count: ssItem.sellerCount
                })
                sum = sum + ssItem.sellerPrice * ssItem.sellerCount
            }
        }

        const tradeData = {
            cusId: orderData.value.customer.id,
            shopId: shopId,
            sellers: sellers,
            sum: sum,
        }
        // console.log(tradeData)

        request.post('/trade_add', tradeData).then(res => {
            if(res.code === 200) {
                // ElMessage.success('订单交易成功')
            } else {
                // ElMessage.error('交易失败')
            }
        })
    }
    ElMessage.success('订单交易成功')
    router.push('/cus/trade')
}
</script>

<template>
    <div class="container">
        <div class="left-container">
            <div class="address-box card">
                <div class="address-top">
                    <span style="font-weight: 600; flex: 1;">确认收货地址</span>
                    <div class="address-top-right">
                        <span style="margin-right: 10px;">使用新地址</span>
                        <span>管理地址</span>
                    </div>
                </div>
                <div class="address-items">
                    <div :class="isAddress[index]?'address-item':'address-item-default'" v-for="(item,index) in orderData.customer.address" :key="item" @click="handleAddressClick(index)">
                        <el-icon :color="isAddress[index]?'#02B6FD':'black'" size="26px"><Location /></el-icon>
                        <div class="address-text">
                            <span class="address-former" style="font-size: 12px;">{{ item.former }}</span>
                            <span class="address-detail" style="font-size: 14px; font-weight: 600;">{{ item.detail }}</span>
                            <span class="address-name" style="font-size: 12px;">{{ item.name }}</span>
                            <span class="address-mobile" style="font-size: 12px;">{{ item.mobile }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="order-box card">
                <span style="font-weight: 600;">确认订单信息</span>
                <div class="order-header card">
                    <div class="header-title" style="width: 300px;">店铺宝贝</div>
                    <div class="header-class" style="width: 200px;">商品属性</div>
                    <div class="header-price" style="width: 100px; text-align: right;">原价</div>
                    <div class="header-count" style="width: 150px; text-align: center;">数量</div>
                    <div class="header-sum" style="text-align: right; width: 80px;">小计</div>
                </div>
                <div class="order-detail card" v-for="item in orderData.seller" :key="item">
                    <div class="detail-shop">
                        <span style="margin: 0 10px; font-weight: 600;">{{ item.shopName }}</span>
                    </div>
                    <div class="detail-detail">
                        <div class="detail-name">
                            <img class="detail-img" :src="item.sellerImg" alt="">
                            <div class="detail-title" style="">{{ item.sellerTitle }}</div>
                        </div>
                        <div class="detail-class" style="width: 200px; font-size: 13px;">{{ item.sellerClass }}</div>
                        <div class="detail-price" style="width: 100px; text-align: right; margin-right: 15px;">￥ {{ item.sellerPrice/100 }}</div>
                        <el-input-number size="small" v-model="item.sellerCount" :min="1" :max="999" @change="handleCountChange"></el-input-number>
                        <div class="header-sum" style="text-align: right; width: 100px;;">￥ {{ item.sellerPrice*item.sellerCount/100 }}</div>
                    </div>
                    <div class="detail-notes">
                        <span style="margin: 0 10px;">订单备注</span>
                        <input type="text">
                    </div>
                </div>
            </div>
        </div>
        <div class="right-container">
            <div class="trade-box card">
                <div class="trade-header">
                    <span style="font-weight: 600;">付款详情</span>
                    <span style="margin: 0 5px;">共 {{ sumCount }} 件商品</span>
                </div>
                <div class="sum-price">
                    <span style="flex: 1;">商品总价</span>
                    <span>￥ {{ sumPrice/100 }}</span>
                </div>
                <el-divider />
                <div class="submit-box">
                    <div class="true-price">
                        <span>实付款</span>
                        <span>￥ {{ sumPrice/100 }}</span>
                    </div>
                    <div class="submit-button" @click=handleSubmit>提交订单</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    margin: 10px 20px;
    display: flex;
    border-radius: 5px;
}

.container {
    display: flex;
    background-color: #F3F6F8;
}

.left-container {
    width: 1000px;
    display: flex;
    flex-direction: column;
}

.right-container {
    width: 400px;
}

.address-box {
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    padding: 10px;
}

.order-box {
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    padding: 10px;
}

.address-top {
    display: flex;
    margin-bottom: 10px;
}

.address-item {
    width: 250px;
    display: flex;
    border: 2px solid #02B6FD;
    padding: 10px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
}

.address-item-default {
    width: 250px;
    display: flex;
    border: 2px solid black;
    padding: 10px;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
}

.address-text {
    display: flex;
    flex-direction: column;
}

.address-items {
    display: flex;
    flex-wrap: wrap;
}

.order-header {
    background-color: #F3F6F8;
    padding: 10px;
}

.order-detail {
    padding: 0 0;
    background-color: #F3F6F8;
    display: flex;
    flex-direction: column;
}

.detail-detail {
    background-color: #FFF;
    display: flex;
    height: 100px;
    align-items: center;
}

.detail-img {
    height: 70px;
    border-radius: 5px;
    margin: 0 10px;
}

.trade-box {
    background-color: #FFF;
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
}

.trade-header {
    display: flex;
}

.sum-price {
    display: flex;
}

.submit-box {
    display: flex;
}

.true-price {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.submit-button {
    border-radius: 5px;
    background-color: #02B6FD;
    color: #FFF;
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    cursor: pointer;
}

.detail-name {
    width: 310px;
    display: flex;
    align-items: center;
}

.detail-shop {
    display: flex;
    align-items: center;
    padding: 10px;
}

.detail-notes {
    display: flex;
    align-items: center;
    padding: 10px;
}

.detail-title {
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.detail-class {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: #8d8d8d;
}
</style>