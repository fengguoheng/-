<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span v-if="userInfo" class="designer">欢迎{{ username }}</span>
        </div>
        <el-menu class="nav-menu" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item @click="toPerson" index="personal">个人主页</el-menu-item>
            <el-menu-item index="friends">好友</el-menu-item>
            <el-menu-item index="game">游戏</el-menu-item>
            <el-menu-item index="about">关于我们</el-menu-item>
            <el-menu-item index="exit">退出</el-menu-item>
        </el-menu>
        <div class="blog-container">
            <el-card v-for="blog in sortedBlogs" :key="blog.id" class="blog-card">
                <template #header>
                    <h3>{{ blog.title }}</h3>
                    <h4>{{ blog.username }}</h4>
                    <span class="blog-date">{{ new Date(blog.date).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }) }}</span>
                </template>
                <div class="blog-content">
                    {{ blog.content }}
                </div>
            </el-card>
        </div>
        <button @click='toWrite' id="writeArticleBtn">撰写文章</button>
    </div>
    <!-- 隐藏的音频容器 -->
    <audio id="musicPlayer" src="船长.mp3" controls style="display: none;"></audio>

    <!-- 播放音乐按钮 -->
    <button ref="musicBtnRef" class="music-btn" @click="playMusic()">播放音乐</button>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import router from '../router/index.js';
import apiUrl from '../config.js';

import { useRoute } from 'vue-router';

// 合并重复导入，优化代码结构
const isLoggedIn = ref(false);
const userInfo = ref({});
const activeIndex = ref('home'); // 设置默认选中项
const sortedBlogs = ref([]); // 存储排序后的博客数据
const extractedData = ref([]);
const username = ref('');
 // 引入钩子

// 定义 route
const route = useRoute();

// 组件挂载时触发

const handleSelect = (index) => {
    console.log('当前选中：', index);
    if (index === 'home') {
        router.push('/home');
    }
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
};

const fetchUserBlogs = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/getBlogs`);
        sortedBlogs.value = response.data;
        extractedData.value = sortedBlogs.value.map((blogItem) => ({
            date: blogItem.date,
            title: blogItem.title,
            content: blogItem.content,
            username: blogItem.username,
        }));
    } catch (error) {
        console.log('获取博客失败:', error);
    }
};
const toWrite = () => {
    router.push('/write'); // 使用 router.push 进行路由跳转 
}
onMounted(async () => {
    try {
        username.value = route.query.username || '';
        localStorage.setItem('username', username.value);
        fetchUserBlogs();

    } catch (error) {
        console.error('验证登录状态出错:', error);
    }
});
const toPerson = () => {
    router.push('/person'); // 使用 router.push 进行路由跳转
};

</script>

<style scoped>
.nav-container {
    background: #e3e9f3;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-section {
    text-align: center;
    margin-bottom: 20px;
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

.nav-menu {
    justify-content: center;
    gap: 12px;
}

.el-menu-item {
    padding: 12px 22px;
    border-radius: 8px;
    font-size: 16px;
}

.blog-container {
    padding: 20px;
}

.blog-card {
    margin-bottom: 20px;
}

.blog-date {
    float: right;
    color: #999;
}

.blog-content {
    margin-top: 10px;
}

#writeArticleBtn {
    position: fixed;
    /* 固定定位 */
    bottom: 30px;
    /* 距离底部30px */
    right: 30px;
    /* 距离右侧30px */
    padding: 12px 24px;
    background-color: #409eff;
    /* 按钮颜色 */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    z-index: 999;
    /* 确保按钮在顶层 */
}

/* 固定按钮样式 */
.music-btn {
    position: fixed;
    top: 20px;
    /* 距离顶部20px */
    right: 20px;
    /* 距离右侧20px */
    padding: 10px 20px;
    background-color: #42b983;
    /* 按钮颜色 */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999;
    /* 确保按钮在顶层 */
}
</style>