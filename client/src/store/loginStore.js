import { defineStore } from 'pinia';
import axios from 'axios';
import apiUrl from '../config.js';
export const useLoginStore = defineStore('login', {
    state: () => ({
        form: {
            username: '',
            password: '',

        },
        message: '',
        loginError: false,
        email: '',
        isLoggedIn: false,
    }),
    actions: {
        async sqlLogin() {
            try {

                const response = await axios.post(
                    `${apiUrl}/api/sqlLogin`,
                    {
                        username: this.form.username,
                        password: this.form.password
                    },
                    {
                        withCredentials: true // 单个请求配置携带 Cookie
                    }
                );
                if (response.data.message === 'SQL 数据库登录成功') {
                    this.loginError = false;
                    this.message = response.data.message;
                    this.email = response.data.email;
                    this.isLoggedIn = response.data.b;
                    console.log(this.isLoggedIn);
                    localStorage.setItem('isLoggedIn', this.isLoggedIn);
                    localStorage.setItem('email', this.email);

                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('id', response.data.id);

                    return true; // 表示登录成功
                } else {
                    this.loginError = true;
                    this.message = response.data.message;
                    return false;
                }
            } catch (error) {
                this.message = 'SQL 登录失败';
                return false;
            }
        },
    },
});
