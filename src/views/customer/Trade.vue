<script setup>
import TradeTable from '../../components/TradeTable.vue';
import { ref } from 'vue';
import request from '@/utils/request'

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const tradeData = ref([])

function getTrade(){
    request.post('/trade_select_byCusId', {id: user._id}).then(res => {
        if(res.code === 200) {
            tradeData.value = res.data
        } else {
            ElMessage.error(res.msg)
        }
        tradeData.value.reverse()
    })
}

getTrade()
</script>

<template>
    <div class="trade-container">
        <div class="trade-title">我的订单</div>
        <TradeTable status="CUS" :data="tradeData"></TradeTable>
    </div>
</template>

<style scoped>
.card {
    margin: 20px;
    display: flex;
    border-radius: 5px;
    border: 1px solid #7A7A7A;
    background-color: #FFF;
}

.trade-container {
    display: flex;
    flex-direction: column;
}

.trade-title {
    font-size: 25px;
}
</style>