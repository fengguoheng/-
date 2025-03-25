<template>
    <div class="message-page">
        <div class="header">
            <h1 class="title">消息通知</h1>
            <span v-if="userInfo" class="welcome-text">欢迎{{ username }}</span>
        </div>
        <button @click="getMessage" class="refresh-btn">刷新消息</button>
        <div v-for="(message, index) in messages" :key="index" class="message-item">
            <div class="message-header">
                <h3>{{ message.title }}</h3>
                <span class="message-date">{{ new Date(message.date).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                    }) }}</span>
            </div>
            <p class="message-content">{{ message.content }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import apiUrl from '../config.js';

const messages = ref([]);
const userInfo = ref({});
const username = ref('');

const getMessage = async () => {
    if (!username.value) return;
    try {
        const response = await axios.get(`${apiUrl}/api/getMessage/${username.value}`);
        messages.value = response.data;
    } catch (error) {
        console.error('获取消息失败:', error);
    }
};

onMounted(async () => {
    try {
        username.value = localStorage.getItem('username');
        await getMessage();
    } catch (error) {
        console.error('验证登录状态出错:', error);
    }
});
</script>

<style scoped>
.message-page {
    background-color: #f4f7f9;
    padding: 20px;
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title {
    font-size: 28px;
    color: #007bff;
    margin: 0;
}

.welcome-text {
    font-size: 16px;
    color: #6c757d;
}

.refresh-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.refresh-btn:hover {
    background-color: #0056b3;
}

.message-item {
    background-color: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.message-date {
    color: #999;
    font-size: 14px;
}

.message-content {
    font-size: 16px;
    color: #333;
}
</style>