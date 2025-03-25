<template>
    <el-container class="register-container">
        <el-main>
            <el-card class="register-card">
                <template #header>
                    <h1>注册账号</h1>
                </template>
                <el-form ref="formRef" :model="formData">
                    <el-form-item>
                        <el-input 
                            v-model="formData.username" 
                            placeholder="请输入用户名"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input 
                            v-model="formData.password" 
                            type="password" 
                            placeholder="请输入密码"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input 
                            v-model="formData.email" 
                            placeholder="请输入邮箱"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            type="primary" 
                            style="width: 100%; text-align: center;" 
                            @click="handleRegister"
                        >
                            注册
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { ElMessage } from 'element-plus';
import apiUrl from '../config.js';

// 表单数据
const formData = ref({
    username: '',
    password: '',
    email: '',
});

// 组件内守卫 - 离开当前组件时触发
onBeforeRouteLeave((to, from) => {
    console.log(`离开注册页面的组件内守卫:即将从 ${from.path} 导航到 ${to.path}`);
    return true;
});

// 组件内守卫 - 路由更新时触发（当前组件实例复用情况下）
onBeforeRouteUpdate((to, from) => {
    console.log('注册页面 组件路由更新前的守卫');
    return true;
});

// 处理注册逻辑
const handleRegister = () => {
    // 先检查表单信息是否完整
    if (!formData.value.username || !formData.value.password || !formData.value.email) {
        ElMessage.error('请填写完整信息！');
        return;
    }

    // 发送注册请求到后端
    fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // 解析 JSON 响应体
            }
            throw new Error('注册请求失败');
        })
        .then(data => {
            if (data.success) {
                ElMessage.success('注册成功！');
                // 清空表单
                formData.value.username = '';
                formData.value.password = '';
                formData.value.email = '';
            } else {
                ElMessage.error(data.message || '注册失败，请稍后重试');
            }
        })
        .catch(error => {
            console.error('注册请求出错:', error);
            ElMessage.error('注册请求出错，请稍后重试');
        });
};
</script>

<style scoped>
.register-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.register-card {
    width: 300px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: white;
}

.el-form-item {
    margin-bottom: 16px;
}
</style>