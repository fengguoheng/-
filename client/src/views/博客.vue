<template>
    <div class="blog-detail-container">
        <h1 class="blog-title">博客详情</h1>
        <div class="blog-meta">
            <p>题目：{{ blogData.title }}</p>
            <p>作者: {{ blogData.username }}</p>
            <p>发布时间: {{ new Date(blogData.date).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }) }}</p>
        </div>
        <div class="blog-content-section auto-wrap-content">
            <p>内容: {{ blogData.content }}</p>
        </div>
        <h2 class="comment-title">评论列表（共 {{ commentCount }} 条评论）</h2>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span>评论操作</span>
            <el-button @click="toggleAllComments">{{ isCollapsed ? '展开所有评论' : '折叠所有评论' }}</el-button>
        </div>
        <ElCollapse v-if="isCollapsed" v-model:value="activeNames">
            <ElCollapseItem v-for="(comment, index) in blogData.comments" :key="index" :name="`comment-${index}`"
                :title="`评论者: ${comment.username} | 评论时间: ${new Date(comment.date).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })}`">
                <div class="comment-meta">
                    <p>评论者: {{ comment.username }}</p>
                    <p>评论时间: {{ new Date(comment.date).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) }}</p>
                </div>
                <div class="comment-text">
                    <p>评论内容: {{ comment.content }}</p>
                </div>
            </ElCollapseItem>
        </ElCollapse>
        <div class="comment-input-section">
            <el-input v-model="commentInput" placeholder="请输入评论" class="comment-input"></el-input>
            <el-button type="primary" @click="addLike()">点赞</el-button>
            <el-button type="primary" @click="addComment(blogData.date, 0, blogData.username)">发表评论</el-button>
        </div>
        <div class="blog-like-count">
            <p>博客总点赞数: {{ totalLikes }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import apiUrl from '../config.js';
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus';

const blogData = ref({});
const commentInput = ref('');
// 存储当前展开的折叠项的标识
const activeNames = ref([]);
// 记录评论是否处于折叠状态，初始为true
const isCollapsed = ref(true);
// 存储总的点赞数量
const totalLikes = ref(0);

// 计算评论数量的计算属性
const commentCount = computed(() => {
    return blogData.value.comments? blogData.value.comments.length : 0;
});

const addComment = async (blogDate, index, ownerUsername) => {
    const content = commentInput.value;
    if (!content.trim()) return;
    const encodedUsername = encodeURIComponent(ownerUsername);
    const requestUrl = `${apiUrl}/api/addComment/${encodedUsername}/${blogDate}`;
    try {
        const response = await axios.post(requestUrl, { content, username: localStorage.getItem('username') });
        // 重新获取最新的评论数据
        const updatedCommentsRes = await axios.get(`${apiUrl}/api/getComments`);
        const allComments = updatedCommentsRes.data;
        // 过滤出当前博客的评论
        const currentBlogComments = allComments.filter(comment => comment.blogDate === blogDate);
        blogData.value.comments = currentBlogComments;
        commentInput.value = '';
    } catch (error) {
        console.error('发表评论失败:', error);
    }
};

const toggleAllComments = () => {
    if (isCollapsed.value) {
        // 获取所有评论的标识
        const names = blogData.value.comments.map((_, index) => `comment-${index}`);
        // 设置为展开所有评论
        activeNames.value = names;
    } else {
        // 清空，即折叠所有评论
        activeNames.value = [];
    }
    // 切换折叠状态
    isCollapsed.value = !isCollapsed.value;
};

const addLike = async () => {
    const likeUsername = localStorage.getItem('username');
    const requestUrl = `${apiUrl}/api/addLike/${blogData.value.username}/${blogData.value.date}`;
    try {
        const response = await axios.post(requestUrl, {
            username: blogData.value.username,
            date: blogData.value.date,
            likeUsername: likeUsername,
        });
        // 假设后端返回更新后的点赞数量
        totalLikes.value = response.data.totalLikes;
    } catch (error) {
        console.error('点赞失败:', error);
    }
};

const getTotalLikes = async () => {
    const requestUrl = `${apiUrl}/api/getTotalLikes/${blogData.value.username}/${blogData.value.date}`;
    try {
        const response = await axios.get(requestUrl);
        if (response.data) {
            totalLikes.value = response.data.number;
        }
    } catch (error) {
        console.error('获取总点赞数失败:', error);
    }
};

onMounted(() => {
    const storedData = localStorage.getItem('selectedBlogData');
    if (storedData) {
        blogData.value = JSON.parse(storedData);
        
    }
    getTotalLikes();
});
</script>

<style scoped>
.blog-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.blog-title {
    font-size: 24px;
    margin-bottom: 15px;
    color: #333;
}

.blog-meta {
    margin-bottom: 15px;
    color: #666;
}

.auto-wrap-content {
    word-wrap: break-word;
    margin-bottom: 20px;
}

.comment-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
}

.comment-list {
    list-style: none;
    padding: 0;
}

.comment-item {
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
}

.comment-meta {
    margin-bottom: 5px;
    color: #666;
}

.comment-text {
    color: #333;
}

.comment-input-section {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.comment-input {
    flex: 1;
}
</style>