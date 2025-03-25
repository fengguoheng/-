<template>
    <div class="login-container">
        <el-card class="login-card">
            <template #header>
                <h2>博客系统</h2>
            </template>
            <el-form :model="loginStore.form" ref="formRef">
                <el-form-item>
                    <el-input v-model="loginStore.form.username" placeholder="用户名"
                        :class="{ 'error-input': loginStore.loginError }" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginStore.form.password" placeholder="密码" type="password" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%; text-align: center;"
                        @click="handleSqlLogin">登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%; text-align: center;"
                        @click="toRegister">现在去注册</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%; text-align: center;" @click="handleGithubLogin">使用
                        GitHub
                        登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%; text-align: center;"
                        @click="handleVisitorLogin">游客</el-button>
                </el-form-item>
            </el-form>
            <p>{{ loginStore.message }}</p>
        </el-card>
        <img src="background.jpg" alt="背景图" class="bg-image" />
    </div>
</template>

<script setup>
import { defineEmits, ref } from 'vue';
import { useLoginStore } from '../store/loginStore';
import { useRouter } from 'vue-router'; // 引入 useRouter 钩子
const loginStore = useLoginStore();
const emits = defineEmits(['login-success']);
const formRef = ref(null);
const router = useRouter();
import apiUrl from '../config.js';
const handleSqlLogin = async () => {
    const isSuccess = await loginStore.sqlLogin();
    if (isSuccess) {
        emits('login-success');
        router.push('/home');
    }
};
const handleGithubLogin = () => {
    window.location.href = `${apiUrl}/auth/github`;
};
const toRegister = () => {
    router.push('/register'); // 使用 router.push 跳转
};
const handleVisitorLogin = async () => {





    router.push({
        name: 'vistor',

    });
};


</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
}

.login-card {
    width: 300px;
    /* 类似手机宽度 */
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: white;
}

.el-form-item {
    margin-bottom: 16px;
}

.bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}
</style>