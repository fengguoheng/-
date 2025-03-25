<template>
    <div class="add-friend-container">
        <h2>添加好友</h2>
        <form @submit.prevent="addFriend">
            <label for="goalUsername">目标用户名：</label>
            <input type="text" id="goalUsername" v-model="goalUsername" required>
            <button type="submit">发送好友申请</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import apiUrl from '../config.js';
import { onMounted } from 'vue';

const goalUsername = ref('');
const username = ref('');

onMounted(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        username.value = storedUsername;
    } else {
        console.error('未获取到用户名');
    }
});

const addFriend = async () => {
    if (!goalUsername.value) {
        console.error('请输入目标用户名');
        return;
    }
    try {
        const requestData = {
            username: username.value,
            goalUsername: goalUsername.value
        };
        const response = await axios.post(`${apiUrl}/api/addFriend`, requestData);
        console.log('好友申请发送成功', response.data);
    } catch (error) {
        console.error('发送好友申请失败', error);
    }
};
</script>

<style scoped>
.add-friend-container {
    padding: 20px;
    text-align: center;
}

form {
    margin-top: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    padding: 8px;
    margin-bottom: 15px;
    width: 200px;
}

button {
    padding: 8px 16px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>