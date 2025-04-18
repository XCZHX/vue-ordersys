import { ElMessage } from "element-plus";
import router from "../router";
import axios from "axios";

const request = axios.create({
    baseURL: 'https://douumbmxo2.hzh.sealos.run',
    // baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 30000 //后台接口超时时间
})

// request拦截器
// 请求发送前进行一些处理
request.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
        return config
    }, error => {
        return Promise.reject(error)
    }
);

// response拦截器
// 接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果返回的是文件
        if(response.config.responseType === 'blob'){
            return res
        }
        // 兼容服务端返回的字符串数据
        if(typeof res === 'string'){
            res = res ? JSON.parse(res) : res
        }
        // 权限验证不通过给出提示
        if(res.code === '401'){
            ElMessage.error(res.msg);
            router.push("/login")
        }
        
        return res;
    },
    error => {
        console.log('err'+error)
        return Promise.reject(error)
    }
);

export default request