<template>
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
        <div class="search-input-container">
            <input v-model="searchKeyword" type="text" placeholder="请输入搜索关键词" class="search-input" />
            <button @click="handleSearch" class="search-button">搜索</button>
        </div>
        <div class="sort-container">
            <button @click="sortBy('likeCount')">按点赞数量排序</button>
            <button @click="sortBy('commentCount')">按评论数量排序</button>
            <button @click="sortBy('date')">按发布时间排序</button>
        </div>
        <div class="blog-container">
            <el-card v-for="(blog, index) in sortedSearchResults" :key="blog.id" @click="goToNewPage(blog)"
                class="blog-card">
                <template #header>
                    <h3>题目：{{ blog.title }}</h3>
                    <h4>作者：{{ blog.username }}</h4>
                    <span class="blog-date">发布时间：{{ formatDate(blog.date) }}</span>
                </template>
                <p class="comment-count">评论数量：{{ blog.commentCount }}</p>
                <p class="like-count">点赞数量：{{ blog.likeCount }}</p>
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import router from '../router/index.js';
import apiUrl from '../config.js';

const activeIndex = ref('home');
const handleSelect = (index) => {
    console.log('当前选中：', index);
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
};

const searchKeyword = ref('');
const searchResults = ref([]);
const allComments = ref([]);
const musicBtnRef = ref(null);
const userInfo = ref({});
const username = ref('');

const getCommentsForBlog = computed(() => (blogDate) => {
    if (!allComments.value) return [];
    return allComments.value.filter(comment => comment && comment.blogDate === blogDate);
});

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setTime(date.getTime() + 8 * 60 * 60 * 1000); // UTC时间转北京时间，加8小时
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

const fetchSearchResults = async (keyword) => {
    try {
        const [resultsRes, commentsRes] = await Promise.all([
            axios.get(`${apiUrl}/api/search`, { params: { keyword } }),
            axios.get(`${apiUrl}/api/getComments`)
        ]);
        searchResults.value = resultsRes.data;
        allComments.value = commentsRes.data;

        // 预加载点赞数量
        const blogsWithLikes = await Promise.all(searchResults.value.map(async (blog) => {
            const likeCount = await getLikeCount(blog.username, blog.date);
            return {
                ...blog,
                likeCount,
                commentCount: getCommentsForBlog.value(blog.date).length
            };
        }));
        searchResults.value = blogsWithLikes;
    } catch (error) {
        console.error('获取搜索数据失败:', error);
    }
};

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

const goToNewPage = (blog) => {
    const blogComments = getCommentsForBlog.value(blog.date);
    const blogData = {
        content: blog.content,
        comments: blogComments,
        username: blog.username,
        date: blog.date,
        title: blog.title
    };
    localStorage.setItem('selectedBlogData', JSON.stringify(blogData));
    router.push({ name: 'blog' });
};

const getLikeCount = async (blogUsername, blogDate) => {
    try {
        const response = await axios.get(`${apiUrl}/api/getTotallikes/${blogUsername}/${blogDate}`);
        return response.data.number;
    } catch (error) {
        console.error('获取点赞数量失败:', error);
        return 0;
    }
};

const handleSearch = async () => {
    const keyword = searchKeyword.value;
    if (!keyword.trim()) return;
    await fetchSearchResults(keyword);
};

const sortedSearchResults = computed(() => {
    return searchResults.value;
});

const sortBy = (type) => {
    if (type === 'likeCount') {
        searchResults.value.sort((a, b) => b.likeCount - a.likeCount);
    } else if (type === 'commentCount') {
        searchResults.value.sort((a, b) => b.commentCount - a.commentCount);
    } else if (type === 'date') {
        searchResults.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
};

onMounted(async () => {
    try {
        username.value = localStorage.getItem('username');
    } catch (error) {
        console.error('验证登录状态出错:', error);
    }
});
</script>

<style scoped>
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

.search-input-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.search-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px 0 0 4px;
    outline: none;
    width: 200px;
}

.search-button {
    padding: 8px 15px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-button:hover {
    background-color: #66b1ff;
}

.sort-container {
    display: flex;
    justify-content: center;
    margin: 10px 0;
}

.sort-container button {
    margin: 0 10px;
    padding: 6px 12px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.sort-container button:hover {
    background-color: #66b1ff;
}

.blog-container {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.blog-card {
    width: calc(25% - 10px);
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 15px;
    transition: transform 0.2s ease;
}

.blog-card:hover {
    transform: scale(1.03);
    cursor: pointer;
}

.blog-card h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.blog-card h4 {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.blog-date {
    color: #999;
    margin-bottom: 10px;
}

.comment-count,
.like-count {
    color: #666;
    margin-bottom: 5px;
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