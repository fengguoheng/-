<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <div class="nav-container">
        <div class="header-section">
            <div class="center-content">
                <h1 class="title">博·客·系·统</h1>
                <span v-if="userInfo" class="designer">欢迎{{ username }}</span>
            </div>
            <button @click="toSearch" class="search-btn">
                <i class="fa-solid fa-magnifying-glass"></i> <!-- 搜索图标 -->
                <span>搜索</span>
            </button>
        </div>
        <el-menu class="nav-menu" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item @click="toPerson" index="personal">个人主页</el-menu-item>
            <el-menu-item index="friends">好友</el-menu-item>
            <el-menu-item index="game">游戏</el-menu-item>
            <el-menu-item index="about">关于我们</el-menu-item>
            <el-menu-item index="exit">退出</el-menu-item>
        </el-menu>
        <div class="friend-container">
            <el-card v-for="(friend, index) in friendsList" :key="index" class="friend-card" @click="goToOtherProfile(friend)">
                <template #header>
                    <h3>好友：{{ friend }}</h3>
                </template>
            </el-card>
        </div>
        <button @click='toWrite' id="writeArticleBtn">撰写文章</button>
        <!-- 隐藏的音频容器 -->
        <audio id="musicPlayer" src="船长.mp3" controls style="display: none;"></audio>
        <!-- 播放音乐按钮 -->
        <button ref="musicBtnRef" class="music-btn" @click="playMusic()">播放音乐</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '../router/index.js';
import apiUrl from '../config.js';

const activeIndex = ref('friends');
const handleSelect = (index) => {
    console.log('当前选中：', index);
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
};

const friendsList = ref([]);
const musicBtnRef = ref(null);
const userInfo = ref({});
const username = ref('');

const toPerson = () => {
    router.push('/person');
};

const toWrite = () => {
    router.push('/write');
};

const playMusic = () => {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer.paused) {
        musicPlayer.play();
        musicBtnRef.value.textContent = "暂停音乐";
    } else {
        musicPlayer.pause();
        musicBtnRef.value.textContent = "播放音乐";
    }
};

const fetchFriends = async () => {
    try {
        const usernameFromStorage = localStorage.getItem('username');
        const response = await axios.post(`${apiUrl}/api/getFriends`, { username: usernameFromStorage });
        friendsList.value = response.data.friends;
    } catch (error) {
        console.error('获取好友列表失败:', error);
    }
};

const goToOtherProfile = (friend) => {
    router.push({ name: 'another', params: { username: friend } });
};

const toSearch = () => {
    router.push({ name:'search' });
};

onMounted(async () => {
    try {
        username.value = localStorage.getItem('username');
        await fetchFriends();
    } catch (error) {
        console.error('验证登录状态出错:', error);
    }
});
</script>

<style scoped>
/* 样式部分保持不变 */
.nav-container {
    background: #e3e9f3;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-section {
    display: flex;
    align-items: center;
    width: 100%;
}

.center-content {
    flex-grow: 1;
    text-align: center;
}

.title {
    font-size: 28px;
    color: #4CAF50;
    margin: 0;
    font-weight: 600;
}

.designer {
    font-size: 14px;
    color: #6c757d;
    margin-top: 5px;
    display: block;
}

.search-btn {
    background-color: #409eff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 4px;
}

.search-btn:hover {
    background-color: #66b1ff;
    cursor: pointer;
}

.nav-menu {
    justify-content: center;
    gap: 12px;
}

.el-menu-item {
    padding: 12px 22px;
    border-radius: 8px;
    font-size: 16px;
}

.friend-container {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
}

.friend-card {
    width: calc(24% - 5px);
    margin-bottom: 10px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 15px;
    transition: transform 0.2s ease;
}

.friend-card:hover {
    transform: scale(1.03);
    cursor: pointer;
}

.friend-card h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

#writeArticleBtn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 24px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    z-index: 999;
}

.music-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999;
}
</style>