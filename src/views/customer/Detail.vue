<script setup>
import { ref } from 'vue';
import { Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request'
import { Base64 } from 'js-base64';

const route = useRoute()
const router = useRouter()

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const sellerId = {
    id: route.query.id
}

if(!route.query.id){
    //console.log('没有数据')
    router.push('/NotFound')
}else{
    getSeller()
}



const detailData = ref({
    shop: {
        avatar: ''
    },
    seller: {
        img: ''
    }
})

function getSeller(){
    // request.get('/admin_select_all').then(res => {
    //     //console.log(res)
    //     if(res.code === 200) {
    //         //ElMessage.success(res.msg)
    //         tableData.value = res.data
    //     } else {
    //         ElMessage.error('查询失败')
    //     }
    // })
    request.post('/seller_select_byId', sellerId).then(res => {
        if(res.code === 200) {
            detailData.value.seller = res.data
            request.post('/user_select_byId', { id: detailData.value.seller.shopId}).then(res1 => {
                if(res1.code === 200) {
                    detailData.value.shop = res1.data
                } else {
                    ElMessage.error('查询失败')
                }
            })
            for (let i in detailData.value.seller.sClass) {
                if(i == 0){
                    isClassItem.value.push(true)
                }else {
                    isClassItem.value.push(false)
                }
            }
        } else {
            ElMessage.error('查询失败')
        }
    })
}

const rateColors = ref([
    '#02B6FD','#02B6FD','#02B6FD'
])
const isClassItem = ref([])

const cnt = ref(1)

const handleItemClick = (index) => {
    for (let i in detailData.value.seller.sClass) {
    if(i == index){
        isClassItem.value[i] = true
    }else {
        isClassItem.value[i] = false
    }
}
}
const isFavor = () => {
    detailData.value.seller.isFavor = !detailData.value.seller.isFavor
}

const handleBuy = () => {
    const buyData = {
        sellerId: detailData.value.seller._id,
        sellerPrice: detailData.value.seller.price,
        sellerImg: detailData.value.seller.img,
        sellerCount: cnt.value,
        sellerClass: detailData.value.seller.sClass[isClassItem.value.indexOf(true)],
        sellerTitle: detailData.value.seller.title,
        shopId: detailData.value.shop._id,
        shopName: detailData.value.shop.name
    }
    // console.log(buyData)
    router.push(`/cus/order?val=${Base64.encode(JSON.stringify([buyData]), true)}`)
}

const handleAddCart = () => {
    const addCartData = {
        cusId: user._id,
        sellerId: detailData.value.seller._id,
        sClass: detailData.value.seller.sClass[isClassItem.value.indexOf(true)],
        count: cnt.value
    }
    request.post('/cart_add', addCartData).then(res => {
        if(res.code === 200) {
            ElMessage.success('已添加至购物车')
        } else {
            ElMessage.error('添加失败')
        }
    })
}

</script>

<template>
    <div class="container" v-if="route.query.id">
        <div class="shop-container">
            <div class="shop-detail">
                <img :src="detailData.shop.avatar" alt="">
                <div class="shop-right">
                    <span class="shop-name">{{ detailData.shop.name }}</span>
                    <el-rate
                        disabled
                        show-score
                        text-color="#02B6FD"
                        score-template="{value}"
                        :colors="rateColors"
                    />
                </div>
            </div>
            <el-button>进入店铺</el-button>
        </div>
        <div class="seller-container">
            <div class="seller-img">
                <img :src="detailData.seller.img" alt="">
            </div>
            <div class="seller-detail">
                <span class="seller-title">{{ detailData.seller.title }}</span>
                <span class="seller-price">{{ detailData.seller.price/100 }}</span>
                <div class="seller-class">
                    <span>分 类</span>
                    <div class="seller-class-box">
                        <div class="seller-items" v-for="(item,index) in detailData.seller.sClass" :key="item">
                            <div :class="isClassItem[index]?'seller-item':'seller-item-default'" @click="handleItemClick(index)">{{ item }}</div>
                        </div>
                    </div>
                </div>
                <div class="seller-count">
                    <span>数 量</span>
                    <el-input-number class="count" v-model="cnt" :min="1" :max="999"/>
                </div>
                <div class="seller-opration">
                    <div class="left-op">
                        <div class="buy-button" @click="handleBuy">立即购买</div>
                        <div class="cart-button" @click="handleAddCart">加入购物车</div>
                    </div>
                    <div class="right-op">
                        <div :class="detailData.seller.isFavor?'favor-button':'favor-button-default'"  @click="isFavor">
                            <el-icon size="22px"><Star /></el-icon>
                            <span style="font-size: 12px;">收藏</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 1000px) {
    .seller-container {
        /* display: flex; */
        flex-direction: column;
        /* width: 1100px; */
    }
}

.card {
    margin: 10px 20px;
    padding: 10px;
    display: flex;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    background-color: #FFF;
}

.container {
    display: flex;
    flex-direction: column;
    margin: 20px 0;
    width: 1000px;
    min-width: 400px;
}

.shop-container {
    display: flex;
    margin: 20px 0;
}

.shop-container img {
    height: 48px;
    border-radius: 8px;
}

.seller-container {
    display: flex;
    width: 1100px;
}

.seller-img img {
    height: 500px;
    border-radius: 15px;
}

.seller-detail {
    display: flex;
    flex-direction: column;
    margin: 10px 50px;
    width: 450px;
}

.seller-title {
    font-size: 22px;
    font-weight: 550;
    margin-bottom: 10px;
}

.seller-price {
    font-size: 28px;
    color: #02B6FD;
    font-weight: 600;
}

.seller-class {
    display: flex;
    margin: 10px 0;
}

.seller-count {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

.seller-opration {
    display: flex;
    margin-top: 20px;
}

.left-op {
    display: flex;
    height: 45px;
    margin-right: 20px;
}

.buy-button {
    background: linear-gradient(
        to right, 
        #00e1ff,
        #00c3ff
    );
    width: 180px;
    border-radius: 10px 0 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    cursor: pointer;
    font-weight: 600;
}

.cart-button {
    background: linear-gradient(
        to right, 
        #02a1fd,
        #02b6fd
    );
    width: 180px;
    border-radius: 0 10px 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    cursor: pointer;
    font-weight: 600;
}

.right-op {
    display: flex;
    align-items: center;
    justify-content: center;
}

.favor-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color:#02B6FD;
    cursor: pointer;
}

.favor-button-default {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
}

.seller-class-box {
    display: flex;
    width: 400px;
    flex-wrap: wrap;
}

.seller-items {
    margin: 5px 10px;
}

.seller-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #02B6FD;
    border-radius: 5px;
    color: #02B6FD;
    padding: 5px 10px;
    cursor: pointer;
    white-space: nowrap;
}

.seller-item-default {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #bebebe;
    border-radius: 5px;
    color: #bebebe;
    padding: 5px 10px;
    cursor: pointer;
    white-space: nowrap;
}

.count {
    margin: 0 10px;
}

.shop-detail {
    display: flex;
    flex: 1;
}

.shop-right {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
}

.shop-name {
    font-size: 18px;
    font-weight: 600;
}
</style>