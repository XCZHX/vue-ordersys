<script setup>
import { ref } from 'vue';

const props = defineProps({
    status: {
        type: String,
        default: 'CUS'
    },
    data: {
        type: Array,
        default: [{}]
    }
})

const searchButton = ref(true)

const nameHide = (name) => {
    if(name.length === 1) return name+'*'
    else if(name.length === 2) return name.charAt(0)+'*'
    else return name.charAt(0)+'***'+name.slice(-1)
}

</script>

<template>
    <div class="order-box">
        <div class="order-header card">
            <div class="header-title" style="width: 400px;">宝贝</div>
            <div class="header-price" style="width: 100px; text-align: center;">单价</div>
            <div class="header-count" style="width: 100px; text-align: center;">数量</div>
            <div class="header-sum" style="width: 100px; text-align: center;">实付款</div>
            <div class="header-state" style="width: 100px; text-align: center;">交易状态</div>
            <div class="header-opration" style="width: 100px; text-align: center;">交易操作</div>
        </div>
        <div class="order-detail card" v-for="item in data" :key="item">
            <div class="detail-shop">
                <span style="margin-right: 10px;">{{ item.date }}</span>
                <span style="margin-right: 50px;">订单号：{{ item.id }}</span>
                <span v-if="status === 'CUS'" style="margin: 0 10px; font-weight: 600;">{{ item.shopTitle }}</span>
                <span v-else-if="status === 'SHOP'" style="margin: 0 10px; font-weight: 600;">顾客：{{ nameHide(item.cusName) }}</span>
            </div>
            <div class="detail-detail">
                <div class="detail-seller">
                    <div class="detail-name" v-for="i in item.sellers" :key="i">
                        <div class="detail-bb">
                            <img class="detail-img" :src="i.img" alt="">
                            <div>
                                <span class="detail-title" style="font-weight: 600; overflow: hidden;">{{ i.title }}</span>
                                <div class="detail-class" style="">{{ i.sClass }}</div>
                            </div>
                        </div>
                        <div class="detail-price" style="width: 100px; text-align: center;">￥{{ i.price/100 }}</div>
                        <div class="detail-count" style="width: 100px; text-align: center;">{{ i.count }}</div>
                    </div>
                </div>
                <div class="detail-sum" style="width: 100px; text-align: center;">￥{{ item.sum/100 }}</div>
                <div class="detail-state" style="">
                    <span v-if="item.state === 1">待发货</span>
                    <span v-else-if="item.state === 2">待签收</span>
                    <span v-else-if="item.state === 3">待评价</span>
                    <span v-else-if="item.state === 4">已取消</span>
                    <span v-else>已完成</span>
                </div>
                <div class="detail-opration" style="width: 100px; text-align: center;" v-if="status === 'CUS'">
                    <el-button v-if="item.state === 1">取消订单</el-button>
                    <el-button v-else-if="item.state === 2">签收</el-button>
                    <el-button v-else-if="item.state === 3">评价</el-button>
                </div>
                <div class="detail-opration" style="width: 100px; text-align: center;" v-if="status === 'SHOP'">
                    <el-button v-if="item.state === 1">发货</el-button>
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

.order-box {
    margin: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    background-color: #FFF;
    padding: 10px;
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
    align-items: center;
    /* flex-direction: column; */
}

.detail-img {
    height: 70px;
    border-radius: 5px;
    margin: 0 10px;
}

.detail-seller {
    display: flex;
    flex-direction: column;
    width: 600px;
}

.detail-name {
    display: flex;
    align-items: center;
}

.detail-bb {
    width: 400px;
    display: flex;
    margin: 10px;
}

.detail-shop {
    display: flex;
    align-items: center;
    padding: 10px;
}

.detail-class {
    color: #707070;
    font-size: 13px;
    margin-top: 5px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.detail-title {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.detail-state {
    width: 100px;
    text-align: center;
}
</style>