<template>
    <div class="nav-container">
        <div class="header-section">
            <h1 class="title">博·客·系·统</h1>
            <span class="designer">欢迎{{ username }}</span>
        </div>
        <el-menu class="nav-menu" mode="horizontal" :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="personal">个人主页</el-menu-item>
            <el-menu-item index="friends">好友</el-menu-item>
            <el-menu-item index="game">游戏</el-menu-item>
            <el-menu-item index="about">关于我们</el-menu-item>
            <el-menu-item index="exit">退出</el-menu-item>
        </el-menu>
        <div class="blog-container">
            <el-card v-for="blog in extractedData" :key="blog.id" @click="goToBlogPage(blog)" class="blog-card">
                <template #header>
                    <h3>{{ blog.title }}</h3>
                    <h4>{{ blog.username }}</h4>
                    <span class="blog-date">{{ formatDate(blog.date) }}</span>
                </template>
                <p class="comment-count">评论数量：{{ getCommentsForBlog(blog.date).length }}</p>
                <p class="like-count">点赞数量：{{ blog.likeCount }}</p>
                <el-button type="danger" @click.stop="deleteBlog(blog)">删除</el-button>
            </el-card>
        </div>
        <div class="fixed-button-container">
            <el-button @click="openFriendApplyDialog">好友申请</el-button>
        </div>
        <ElDialog
            v-model="showFriendApplyDialog"
            title="好友申请"
            center
            width="300px"
        >
            <ul>
                <li v-for="apply in friendApplys" :key="apply.username">
                    {{ apply.username }}的申请 - {{ apply.isReplied }}
                    <el-button type="success" @click="acceptFriendApply(apply.username)">接受</el-button>
                    <el-button type="danger" @click="rejectFriendApply(apply.username)">拒绝</el-button>
                </li>
            </ul>
        </ElDialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import apiUrl from '../config.js';
import { ElDialog } from 'element-plus';

const activeIndex = ref('personal');
const sortedBlogs = ref([]);
const extractedData = ref([]);
const allComments = ref([]);
const username = ref('');
const router = useRouter();
const showFriendApplyDialog = ref(false);
const friendApplys = ref([]);
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
        const [blogsRes, commentsRes] = await Promise.all([
            axios.get(`${apiUrl}/api/personBlogs/${username.value}`),
            axios.get(`${apiUrl}/api/getComments`)
        ]);
        sortedBlogs.value = blogsRes.data.a;
        extractedData.value = sortedBlogs.value.map((blogItem) => ({
            date: blogItem.date,
            title: blogItem.title,
            content: blogItem.content,
            username: blogItem.username
        }));

        allComments.value = commentsRes.data;

        // 预加载点赞数量
        const blogsWithLikes = await Promise.all(extractedData.value.map(async (blog) => {
            const likeCount = await getLikeCount(blog.username, blog.date);
            return {
                ...blog,
                likeCount
            };
        }));
        extractedData.value = blogsWithLikes;
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

const getCommentsForBlog = computed(() => (blogDate) => {
    if (!allComments.value) return [];
    return allComments.value.filter(comment => comment && comment.blogDate === blogDate);
});

const getLikeCount = async (blogUsername, blogDate) => {
    try {
        const response = await axios.get(`${apiUrl}/api/getTotallikes/${blogUsername}/${blogDate}`);
        return response.data.number;
    } catch (error) {
        console.error('获取点赞数量失败:', error);
        return 0;
    }
};

const goToBlogPage = (blog) => {
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

const deleteBlog = async (blog) => {
    try {
        const response = await axios.delete(`${apiUrl}/api/deleteBlogsByTime`, {
            data: {
                date: blog.date
            }
        });
        if (response.status === 200) {
            // 过滤掉被删除的博客
            extractedData.value = extractedData.value.filter(b => b.date !== blog.date);
        } else {
            console.error('删除博客失败，状态码:', response.status);
        }
    } catch (error) {
        console.error('删除博客失败:', error);
    }
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setTime(date.getTime() + 8 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
const openFriendApplyDialog = () => {
    showFriendApplyDialog.value = true;
    fetchFriendApplys();
};
const fetchFriendApplys = async () => {
    try {
        const response = await axios.get(`${apiUrl}/api/getApplys/${username.value}`);
        friendApplys.value = response.data.friendApplys;
    } catch (error) {
        console.error('获取好友申请失败:', error);
    }
};
const acceptFriendApply = async (friendUsername) => {
    try {
        const response = await axios.post(`${apiUrl}/api/updateFriendApply`, {
            currentUsername: username.value,
            friendUsername: friendUsername,
            status: 'accept'
        });
        if (response.status === 200) {
            console.log('接受好友申请成功');
            // 重新获取好友申请列表
            await fetchFriendApplys();
        } else {
            console.error('接受好友申请失败，状态码:', response.status);
        }
    } catch (error) {
        console.error('接受好友申请失败:', error);
    }
};

const rejectFriendApply = async (friendUsername) => {
    try {
        const response = await axios.post(`${apiUrl}/api/updateFriendApply`, {
            currentUsername: username.value,
            friendUsername: friendUsername,
            status: 'reject'
        });
        if (response.status === 200) {
            console.log('拒绝好友申请成功');
            // 重新获取好友申请列表
            await fetchFriendApplys();
        } else {
            console.error('拒绝好友申请失败，状态码:', response.status);
        }
    } catch (error) {
        console.error('拒绝好友申请失败:', error);
    }
};
onMounted(async () => {
    try {
        username.value = localStorage.getItem('username');
        await fetchUserBlogs();
        await fetchFriendApplys();
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

.el-button {
    margin-top: 10px;
}
.personal-page-section {
    text-align: center;
    margin-top: 20px;
}

.friend-apply-dropdown {
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px;
    list-style-type: none;
    min-width: 200px;
    z-index: 1;
}
.friend-apply-dropdown {
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px;
    list-style-type: none;
    min-width: 200px;
    z-index: 1;
}

.fixed-button-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
}
</style>