//路由配置文件
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

// 路由懒加载
const Login = () => import('../components/UserLogin.vue');

const Home = () => import('../views/Home.vue');


const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            console.log(`进入Home的路由独享守卫:即将从 ${from.path} 导航到 ${to.path}`);

            next();
        }
    },
    {
        path: '/home',
        name: 'home',//访问时才导入
        component: Home,//components:() => import('../components/UserLogin.vue');
    },
    {
        path: '/register', // 动态路由
        name: 'register',
        component: () => import('../components/UserRegister.vue')
    },
    {
        path: '/person', // 动态路由
        name: 'person',
        component: () => import('../views/个人主页.vue')
    },
    {
        path: '/write',
        name: 'write',
        component: () => import('../views/撰写文章.vue')
    }
    , {
        path: '/third',
        name: 'third',
        component: () => import('../views/github登录首页.vue')
    },
    {
        path: '/shop/', // 新增路径，关联同一组件
        name: 'ShopLogin', // 可自定义路由名
        component: Login // 关联 UserLogin 组件
    },
    {
        path: '/vistor',
        name: 'vistor',
        component: () => import('../views/游客首页.vue')
    },
    {
        path: '/blog',
        name: 'blog',
        // 修改为正确的懒加载形式
        component: () => import('../views/博客.vue')
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('../views/搜索.vue')
    },
    {
        path: '/friends',
        name: 'friends',
        component: () => import('../views/好友.vue')

    },
    {
        path: '/another/:username',
        name: 'another',
        component: () => import('../views/其他人的主页.vue')
    },
    {
        path: '/addFriend/:username', // 动态路由参数
        name: 'addFriend',
        component: () => import('../views/添加好友.vue') // 懒加载组件

    },
    {
        path: '/myblog',
        name: 'myblog',
        component: () => import('../views/我的博客.vue')
    },
    {
        path:'/message',
        name:'message',
        component:() => import('../views/消息通知.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory('/shop/'),
    routes
});

// 全局守卫
router.beforeEach((to, from, next) => {
    console.log();
    console.log(`全局前置守卫:即将从 ${from.path} 导航到 ${to.path}`);
    // 这里可以添加登录验证等逻辑
    next();
});

router.afterEach((to, from) => {
    console.log('全局后置守卫:导航完成');
});

export default router;