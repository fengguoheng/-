<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <div class="nav-container">
        <div class="header-section">
            <div class="center-content">
                <h1 class="title">博·客·系·统</h1>
                <span v-if="userInfo" class="designer">欢迎{{ username }}</span>
            </div>
            <button @click="getMessage" class="get-message">消息通知</button>
            <button @click="addFriend" class='add-friend'>添加好友</button>
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
        <div class="blog-container">
            <el-card v-for="(blog, index) in sortedBlogs" :key="blog.id" @click="goToNewPage(blog)" class="blog-card">
                <template #header>
                    <h3>题目：{{ blog.title }}</h3>
                    <h4>作者：{{ blog.username }}</h4>
                    <span class="blog-date">发布时间：{{ new Date(blog.date).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }) }}</span>
                    <p class="comment-count">评论数量：{{ getCommentsForBlog(blog.date).length }}</p>
                    <p class="like-count">点赞数量：{{ blog.likeCount }}</p>
                </template>
            </el-card>
        </div>
        <button @click='toWrite' id="writeArticleBtn">撰写文章</button>
        <!-- 隐藏的音频容器 -->
        <audio id="musicPlayer" src="船长.mp3" controls style="display: none;"></audio>
        <!-- 播放音乐按钮 -->
        <button ref="musicBtnRef" class="music-btn" @click="playMusic()">播放音乐</button>
        <button @click="toMe" class="myblog">我的博客</button>

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
    if (index === 'friends') {
        router.push('/friends');
        // 可在此处添加退出登录等逻辑
    }
};

const sortedBlogs = ref([]);
const allComments = ref([]);
const musicBtnRef = ref(null);
const userInfo = ref({});
const username = ref('');
const commentInputs = ref([]);
const isCommentCollapsed = ref([]);
const isBlogContentCollapsed = ref([]);

const getCommentsForBlog = computed(() => (blogDate) => {
    if (!allComments.value) return [];
    return allComments.value.filter(comment => comment && comment.blogDate === blogDate);
});

const fetchBlogs = async () => {
    try {
        const [blogsRes, commentsRes] = await Promise.all([
            axios.get(`${apiUrl}/api/getBlogs`),
            axios.get(`${apiUrl}/api/getComments`)
        ]);
        sortedBlogs.value = blogsRes.data;
        allComments.value = commentsRes.data;
        commentInputs.value = new Array(sortedBlogs.value.length).fill('');
        isBlogContentCollapsed.value = new Array(sortedBlogs.value.length).fill(0);
        isCommentCollapsed.value = new Array(sortedBlogs.value.length).fill(0);

        // 预加载点赞数量
        const blogsWithLikes = await Promise.all(sortedBlogs.value.map(async (blog) => {
            const likeCount = await getLikeCount(blog.username, blog.date);
            return {
                ...blog,
                likeCount
            };
        }));
        sortedBlogs.value = blogsWithLikes;
    } catch (error) {
        console.error('获取数据失败:', error);
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
const toSearch = () => {
    router.push({ name: 'search' });
}
const addFriend = () => {
    const username = localStorage.getItem('username');
    if (username) {
        router.push({
            path: `/addFriend/${username}`, // 根据参数路径拼接路径
            params: { username }
        });
    } else {
        console.error('未获取到用户名，无法进行跳转');
    }
};
const toMe = () => {
    router.push({ name: 'myblog' });
}
const getMessage = () => {
    router.push({ name: 'message' });
}

onMounted(async () => {
    try {
        username.value = localStorage.getItem('username');
        await fetchBlogs();

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

.add-friend {
    background-color: #42b983;
    /* 修改背景颜色 */
    color: white;
    padding: 7px 14px;
    /* 修改内边距 */
    border: 1px solid #3c81e0;
    /* 添加边框 */
    border-radius: 3px;
    /* 修改圆角 */
    font-size: 13px;
    /* 修改字体大小 */
    font-weight: 400;
    /* 修改字体粗细 */
    transition: all 0.3s ease;
    /* 过渡效果包含更多属性 */
    display: flex;
    align-items: center;
    gap: 3px;
}

.add-friend:hover {
    background-color: #75aaff;
    cursor: pointer;
}

.get-message {
    background-color: #42b983;
    /* 修改背景颜色 */
    color: white;
    padding: 7px 14px;
    /* 修改内边距 */
    border: 1px solid #3c81e0;
    /* 添加边框 */
    border-radius: 3px;
    /* 修改圆角 */
    font-size: 13px;
    /* 修改字体大小 */
    font-weight: 400;
    /* 修改字体粗细 */
    transition: all 0.3s ease;
    /* 过渡效果包含更多属性 */
    display: flex;
    align-items: center;
    gap: 3px;
}

.get-message:hover {
    background-color: #75aaff;
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

.blog-container {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
}

.blog-card {
    width: calc(24% - 5px);
    margin-bottom: 10px;
    transition: transform 0.2s ease;
}

.blog-card:hover {
    background-color: #f5f5f5;
    transform: scale(1.03);
    cursor: pointer;
}

.blog-card:hover h3 {
    color: #409eff;
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

.comment-section {
    margin-top: 20px;
    padding: 15px;
    border-top: 1px solid #e0e0e0;
}

.comment-item {
    margin-bottom: 10px;
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.comment-username {
    font-weight: bold;
    margin-bottom: 5px;
}

.comment-content {
    font-size: 14px;
    color: #333;
}

.comment-date {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.comment-input {
    margin-top: 15px;
    width: 80%;
}

.comment-btn {
    margin-left: 10px;
    vertical-align: top;
}

@media (max-width: 768px) {
    .blog-card {
        width: 100%;
        margin-bottom: 15px;
    }
}

.blog-card h3 {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
}

.blog-card h4 {
    font-size: 14px;
    color: #666666;
    margin-bottom: 15px;
}

.blog-card.blog-content {
    font-size: 16px;
    color: #333333;
}

.comment-count {
    margin-top: 10px;
    color: #666;
}

.myblog {
    position: fixed;
    top: 30px;
    left: 30px;
    padding: 12px 24px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    z-index: 999;
}
</style>