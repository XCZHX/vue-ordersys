<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request'

const router = useRouter()

const searchTab = ref({
    name: '宝贝'
});

const carouselItems = ref([
    {
        img: 'https://objectstorageapi.hzh.sealos.run/kdubuo6i-sealaf-douumbmxo2-cloud-bin/ordersys/seller1.jpg'
    },
    {
        img: 'https://objectstorageapi.hzh.sealos.run/kdubuo6i-sealaf-douumbmxo2-cloud-bin/ordersys/seller2.jpg'
    },
    {
        img: 'https://objectstorageapi.hzh.sealos.run/kdubuo6i-sealaf-douumbmxo2-cloud-bin/ordersys/seller3.jpg'
    },
    {
        img: 'https://objectstorageapi.hzh.sealos.run/kdubuo6i-sealaf-douumbmxo2-cloud-bin/ordersys/seller4.jpg'
    },
    {
        img: 'https://objectstorageapi.hzh.sealos.run/kdubuo6i-sealaf-douumbmxo2-cloud-bin/ordersys/seller5.jpg'
    },
])

const classItem = ref([
    ["#icon-diannao","电脑","配件","办公","文具"],
    ["#icon-shouji","家电","通讯","手机","数码"],
    ["#icon-chilun","工业品","商业","农业","定制"],
    ["#icon-shafa","家具","家装","家居","厨具"],
    ["#icon-clothes","女装","男装","内衣","配饰"],
    ["#icon-xiezi","女鞋","男鞋","运动","户外"],
    ["#icon-qiche","汽车","珠宝","文玩","箱包"],
    ["#icon-juzi","食品","生鲜","玩具","宠物"],
    ["#icon-chilun","母婴","童装","玩具","宠物"],
])

const handleSearchTab = (command) => {
    if(command === 'a'){
        searchTab.value.name = '宝贝'
    }else{
        searchTab.value.name = '店铺'
    }
}

const handleSearchClick = () => {
    getSellers()
}

const sellerDetailClick = (id) => {
    router.push(`/cus/detail?id=${id}`)
    //console.log(id)
}

const getData = ref({
    condition: ''
})
const sellerData = ref()

function getSellers(){
    // request.get('/admin_select_all').then(res => {
    //     //console.log(res)
    //     if(res.code === 200) {
    //         //ElMessage.success(res.msg)
    //         tableData.value = res.data
    //     } else {
    //         ElMessage.error('查询失败')
    //     }
    // })
    request.post('/seller_select', getData.value).then(res => {
        //console.log(res)
        if(res.code === 200) {
            //ElMessage.success(res.msg)
            sellerData.value = res.data
            //getData.value.paginationData.total = res.total
            //console.log(res)
        } else {
            ElMessage.error('查询失败')
        }
    })
}

getSellers()

</script>

<template>
    <div class="home-body">
        <div class="card search-box">
            <el-dropdown class="search-tab" @command="handleSearchTab">
                <span class="el-dropdown-link" v-bind="searchTab">
                    {{ searchTab.name }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="a">宝贝</el-dropdown-item>
                        <el-dropdown-item command="b">店铺</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-divider direction="vertical" />
            <input v-model="getData.condition" placeholder="猜你喜欢"></input>
            <el-button @click="handleSearchClick">搜索</el-button>
        </div>

        <div class="layout-box">
            <div class="card class-box">
                <div style="font-weight: 600; font-size: 18px;">分 类</div>
                <div class="class-rows">
                    <div class="class-row" v-for="item in classItem" :key="item">
                        <svg class="class-icon">
                            <use :xlink:href="item[0]"></use>
                        </svg>
                        <span class="class-item" @click="">{{ item[1] }}</span>
                        <span>/</span>
                        <span class="class-item">{{ item[2] }}</span>
                        <span>/</span>
                        <span class="class-item">{{ item[3] }}</span>
                        <span>/</span>
                        <span class="class-item">{{ item[4] }}</span>
                    </div>
                </div>
            </div>
            <div class="carousel-container">
                <el-carousel :interval="4000" height="314px">
                    <el-carousel-item v-for="item in carouselItems" :key="item">
                        <img width="600px" height="314px" :src="item.img" alt="">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>

        

        <div class="seller-layout">
            <div class="seller-row">
                <div class="seller-col" v-for="item in sellerData" :key="item" @click="sellerDetailClick(item._id)">
                    <img :src="item.img" alt="">
                    <span class="seller-title">{{ item.title }}</span>
                    <div class="tag-list">
                        <div class="tag-text">包邮</div>
                    </div>
                    <div class="price-wrapper">
                        <span class="price-unit">¥</span>
                        <span class="price">{{ item.price/100 }}</span>
                        <span class="month-sale">2人购买</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 900px) {
    .layout-box {
        display: none !important;
    }

    .seller-row {
        width: 450px !important;
    }

    .search-box {
        width: 400px !important;
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

.search-box {
    width: 800px;
    height: 25px;
    align-items: center;
}

.search-tab .el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    white-space: nowrap;
}

.carousel-container {
    margin: 10px;
    width: 600px;
}

.el-carousel__item img {
    height: 300px;
}

.el-carousel__item {
    display: flex;
    align-items: center;
    justify-content: center;
}

:focus-visible {
    outline: none;
}

.search-box input {
    border: 0;
    box-shadow: none;
    flex: 1;
}

.seller-layout {
    display: flex;
    justify-content: center;
}

.seller-row {
    width: 1100px;
    display: flex;
    flex-wrap: wrap;
}

.seller-col {
    width: 200px;
    height: 300px;
    cursor: pointer;
    margin: 10px;
}

.seller-col img {
    width: 190px;
    border-radius: 10px;
}

.seller-col .seller-title {
    line-height: 24px;
    font-size: 16px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.seller-col .tag-text {
    font-size: 14px;
    color: #02B6FD;
}

.seller-col .price-unit {
    color: #02B6FD;
    font-size: 16px;
}

.seller-col .price {
    color: #02B6FD;
    font-size: 20px;
}

.seller-col .month-sale {
    color: #7A7A7A;
    font-size: 14px;
}

.layout-box {
    display: flex;
    width: 1000px;
    align-items: center;
    justify-content: center;
}

.home-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 600px;
}

.class-box {
    width: 300px;
    display: flex;
    flex-direction: column;
    background-color: #F7F7F7;
}

.class-row span {
    margin: 0 3px;
}

.class-row .class-item:hover {
    color: #02B6FD;
    cursor: pointer;
}

.class-row {
    height: 30px;
    width: 250px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: start;
}

.class-row:hover {
    background-color: #FFF;
}

.class-icon {
    width: 1em;
    height: 1em;
    margin: 0 5px;
    color: black;
}
</style>