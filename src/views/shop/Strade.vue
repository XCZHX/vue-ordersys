<script setup>
import TradeTable from '../../components/TradeTable.vue';
import { ref } from 'vue';
import request from '@/utils/request'

const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const tradeData = ref([])

function getTrade(){
    request.post('/trade_select_byShopId', {id: user._id}).then(res => {
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
    <div class="card">
        <TradeTable status="SHOP" :data="tradeData"></TradeTable>
    </div>
</template>

<style scoped>
.card {
    margin: 10px 20px;
    padding: 10px;
    display: flex;
    border-radius: 5px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    background-color: #FFF;
}

</style>