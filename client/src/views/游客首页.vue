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
            <el-card v-for="(blog, index) in sortedBlogs" :key="blog.id" class="blog-card">
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
                <!-- 评论区域，包裹在折叠组件中 -->
                <el-collapse v-model="isCommentCollapsed[index]" accordion>
                    <el-collapse-item title="评论区">
                        <div v-for="(comment, commentIndex) in getCommentsForBlog(blog.date)" :key="commentIndex"
                            class="comment-item">
                            <div class="comment-username">{{ comment.username }}</div>
                            <div class="comment-content">{{ comment.content }}</div>
                            <span class="comment-date">{{ new Date(comment.date).toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}</span>
                        </div>
                        <el-input v-model="commentInputs[index]" placeholder="请输入评论" class="comment-input"
                            @keyup.enter="addComment(encodeURIComponent(blog.date), index)"></el-input>
                        <el-button type="primary"
                            @click="addComment(encodeURIComponent(blog.date), index, blog.username)"
                            class="comment-btn">
                            发表评论
                        </el-button>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </div>
        <button @click='toWrite' id="writeArticleBtn">撰写文章</button>
        <button @click="toMe" class="myblog">我的博客</button>

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
import { ElCollapse, ElCollapseItem } from 'element-plus';

const activeIndex = ref('home');
const handleSelect = (index) => {
    console.log('当前选中：', index);
    if (index === 'exit') {
        // 可在此处添加退出登录等逻辑
    }
    if (index === 'get') {
        fetchBlogs(); // 调用获取博客数据的函数 
    }
};
const sortedBlogs = ref([]);
const allComments = ref([]);
const musicBtnRef = ref(null);
const isLoggedIn = ref(false);
const userInfo = ref({});
const username = ref('');
const commentInputs = ref([]);
// 用于存储每个博客评论区的折叠状态
const isCommentCollapsed = ref([]);

const getCommentsForBlog = computed(() => (blogDate) => {
    if (!allComments.value) return [];
    return allComments.value.filter(comment => comment && comment.blogDate === blogDate);
});

const fetchBlogs = async () => {
    try {
        // 并发获取博客和评论数据
        const [blogsRes, commentsRes] = await Promise.all([
            axios.get(`${apiUrl}/api/getBlogs`),
            axios.get(`${apiUrl}/api/getComments`)
        ]);
        sortedBlogs.value = blogsRes.data;
        allComments.value = commentsRes.data;
        // 初始化每个博客的评论输入框内容为空字符串
        commentInputs.value = new Array(sortedBlogs.value.length).fill('');
        // 初始化每个博客评论区的折叠状态为折叠
        isCommentCollapsed.value = new Array(sortedBlogs.value.length).fill(true);
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

const toPerson = () => {
    router.push('/person'); // 使用 router.push 进行路由跳转
};

const toWrite = () => {
    router.push('/write'); // 使用 router.push 进行路由跳转 
}

const playMusic = () => {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer.paused) {
        musicPlayer.play();
        musicBtnRef.value.textContent = "暂停音乐"; // 切换为暂停文字
    } else {
        musicPlayer.pause();
        musicBtnRef.value.textContent = "播放音乐"; // 切换回播放文字
    }
};

const addComment = async (blogDate, index, ownerUsername) => {
    const content = commentInputs.value[index];
    if (!content.trim()) return;
    const encodedUsername = encodeURIComponent(ownerUsername); // 使用博客所有者用户名进行编码
    console.log('传递的被评论博客所有者用户名:', encodedUsername);
    console.log('传递的博客日期:', blogDate);
    const requestUrl = `${apiUrl}/api/addComment/${encodedUsername}/${blogDate}`;
    console.log('请求 URL:', requestUrl);
    try {
        const response = await axios.post(requestUrl, { content, username: username.value });
        console.log('评论者的姓名', encodedUsername);
        allComments.value.push({
            date: new Date().toISOString(),
            content,
            blogDate,
            username: encodedUsername
        });
        
        
        commentInputs.value[index] = '';
        

    } catch (error) {
        console.error('发表评论失败:', error);
    }
};
const toMe = () => {
    router.push({ name: 'myblog' });
}

onMounted(async () => {
    try {
        username.value = '游客';
        localStorage.setItem('username',username.value);
        fetchBlogs();
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