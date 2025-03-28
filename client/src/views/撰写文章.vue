<template>
    <div class="article-write-container">
        <el-form ref="formRef" :model="articleForm" :rules="rules" label-width="100px" class="form-container">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
                <el-input v-model="articleForm.content" type="textarea" :rows="5" placeholder="请输入文章内容"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitArticle">提交文章</el-button>
                <el-button style="margin-left: 10px" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import apiUrl from '../config.js';

// 表单数据
const articleForm = ref({
    title: '',
    content: ''
});

// 表单验证规则
const rules = ref({
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
});

// 模板引用
const formRef = ref(null);
const username = ref('');
const userInfo = ref({});
const isLoggedIn = ref(false);

// 提交文章方法
const submitArticle = async () => {
    if (!formRef.value) return;
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                // 替换为实际的接口地址
                const response = await axios.post(`${apiUrl}/api/submitBlogs/${username.value}`, articleForm.value);
                if (response.status === 200) {
                    ElMessage.success('文章提交成功');
                    articleForm.value = { title: '', content: '' };
                } else {
                    ElMessage.error('文章提交失败，请稍后重试');
                }
            } catch (error) {
                console.error('请求出错:', error);
                ElMessage.error('文章提交失败，请稍后重试');
            }
        } else {
            ElMessage.error('请检查表单填写内容');
        }
    });
};

// 取消操作
const cancel = () => {
    articleForm.value = { title: '', content: '' };
    history.back();
};
onMounted(async () => {
    try {
        username.value = localStorage.getItem('username'); // 获取用户名并赋值给响应式变量

        const response = await axios.get(`${apiUrl}/check`, {
            withCredentials: true // 携带 cookie 信息
        });
        if (response.data.isLoggedIn) {
            isLoggedIn.value = true;
            userInfo.value = response.data;
        }
    } catch (error) {
        console.error('验证登录状态出错:', error);
    }




});
</script>

<style scoped>
.article-write-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.form-container {
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>