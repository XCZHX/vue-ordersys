import { createRouter, createWebHistory } from "vue-router";

// const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')

const dict = {
    manager: ['Manager','Home','Admin','User','Self','NotFound'],
    shop: ['Shop','Shome','Seller','Strade','Sself','NotFound'],
    cus: ['Customer','Chome','Detail','Cart','Order','Favor','Member','Trade','TradeDetail','NotFound']
}

// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'Manager',
        component: () => import('@/views/Manager.vue'),
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/manager/Home.vue'),
            },
            {
                path: 'admin',
                name: 'Admin',
                component: () => import('@/views/manager/Admin.vue'),
            },
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/manager/User.vue'),
            },
            {
                path: 'self',
                name: 'Self',
                component: () => import('@/views/manager/Self.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/shop',
        name: 'Shop',
        component: () => import('@/views/Shop.vue'),
        redirect: '/shop/home',
        children: [
            {
                path: 'home',
                name: 'Shome',
                component: () => import('@/views/shop/Shome.vue'),
            },
            {
                path: 'seller',
                name: 'Seller',
                component: () => import('@/views/shop/Seller.vue'),
            },
            {
                path: 'trade',
                name: 'Strade',
                component: () => import('@/views/shop/Strade.vue'),
            },
            {
                path: 'self',
                name: 'Sself',
                component: () => import('@/views/shop/Sself.vue'),
            },
        ],
    },
    {
        path: '/cus',
        name: 'Customer',
        component: () => import('@/views/Customer.vue'),
        redirect: '/cus/home',
        children: [
            {
                path: 'home',
                name: 'Chome',
                component: () => import('@/views/customer/Chome.vue'),
            },
            {
                path: 'detail',
                name: 'Detail',
                component: () => import('@/views/customer/Detail.vue'),
            },
            {
                path: 'cart',
                name: 'Cart',
                component: () => import('@/views/customer/Cart.vue'),
            },
            {
                path: 'order',
                name: 'Order',
                component: () => import('@/views/customer/Order.vue'),
            },
            {
                path: 'favor',
                name: 'Favor',
                component: () => import('@/views/customer/Favor.vue'),
            },
            {
                path: 'member',
                name: 'Member',
                component: () => import('@/views/customer/Member.vue'),
            },
            {
                path: 'trade',
                name: 'Trade',
                component: () => import('@/views/customer/Trade.vue'),
            },
            {
                path: 'tradeDetail',
                name: 'TradeDetail',
                component: () => import('@/views/customer/TradeDetail.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
    },
]

// 创建路由实例，配置路由模式和路由规则
const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // console.log(dict.manager.findIndex('Home'))
    if(to.name == 'Login' && !localStorage.getItem('ordersys-user')){
        next()
    }
    else if(!localStorage.getItem('ordersys-user')){
        next({name:'Login'})
    }else{
        const user = JSON.parse(localStorage.getItem('ordersys-user') || '{}')
        if(user.role === 'ADMIN'){
            if(dict.manager.indexOf(to.name)!=-1) next()
            else if(to.name === 'Login') next({name:'Manager'})
            else next({name:'NotFound'})
        }else if(user.role === 'USER'){
            if(dict.shop.indexOf(to.name)!=-1) next()
            else if(to.name === 'Login') next({name:'Shop'})
            else next({name:'NotFound'})
        }else if(user.role === 'CUS'){
            if(dict.cus.indexOf(to.name)!=-1) next()
            else if(to.name === 'Login') next({name:'Customer'})
            else next({name:'NotFound'})
        }else{
            next({name:'Login'})
        }
    }
    
    // if(to.name != 'Login'){
    //     if(localStorage.getItem('ordersys-user')) next()
    //     else next({name:'Login'})
    // }else{
    //     if(localStorage.getItem('ordersys-user')) next({name:'Manager'})
    //     else next()
    // }
})

// 导出路由实例
export default router