"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[514],{1514:function(e,l,a){a.r(l),a.d(l,{default:function(){return i}});var r=a(641),u=a(953),n=a(5220),t=a(163),o=a(2169),s={__name:"UserRegister",setup(e){const l=(0,u.KR)({username:"",password:"",email:""});(0,n.JZ)(((e,l)=>(console.log(`离开注册页面的组件内守卫:即将从 ${l.path} 导航到 ${e.path}`),!0))),(0,n.V6)(((e,l)=>(console.log("注册页面 组件路由更新前的守卫"),!0)));const a=()=>{l.value.username&&l.value.password&&l.value.email?fetch(`${o.A}/api/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l.value)}).then((e=>{if(e.ok)return e.json();throw new Error("注册请求失败")})).then((e=>{e.success?(t.nk.success("注册成功！"),l.value.username="",l.value.password="",l.value.email=""):t.nk.error(e.message||"注册失败，请稍后重试")})).catch((e=>{console.error("注册请求出错:",e),t.nk.error("注册请求出错，请稍后重试")})):t.nk.error("请填写完整信息！")};return(e,u)=>{const n=(0,r.g2)("el-input"),t=(0,r.g2)("el-form-item"),o=(0,r.g2)("el-button"),s=(0,r.g2)("el-form"),d=(0,r.g2)("el-card"),c=(0,r.g2)("el-main"),i=(0,r.g2)("el-container");return(0,r.uX)(),(0,r.Wv)(i,{class:"register-container"},{default:(0,r.k6)((()=>[(0,r.bF)(c,null,{default:(0,r.k6)((()=>[(0,r.bF)(d,{class:"register-card"},{header:(0,r.k6)((()=>u[3]||(u[3]=[(0,r.Lk)("h1",null,"注册账号",-1)]))),default:(0,r.k6)((()=>[(0,r.bF)(s,{ref:"formRef",model:l.value},{default:(0,r.k6)((()=>[(0,r.bF)(t,null,{default:(0,r.k6)((()=>[(0,r.bF)(n,{modelValue:l.value.username,"onUpdate:modelValue":u[0]||(u[0]=e=>l.value.username=e),placeholder:"请输入用户名"},null,8,["modelValue"])])),_:1}),(0,r.bF)(t,null,{default:(0,r.k6)((()=>[(0,r.bF)(n,{modelValue:l.value.password,"onUpdate:modelValue":u[1]||(u[1]=e=>l.value.password=e),type:"password",placeholder:"请输入密码"},null,8,["modelValue"])])),_:1}),(0,r.bF)(t,null,{default:(0,r.k6)((()=>[(0,r.bF)(n,{modelValue:l.value.email,"onUpdate:modelValue":u[2]||(u[2]=e=>l.value.email=e),placeholder:"请输入邮箱"},null,8,["modelValue"])])),_:1}),(0,r.bF)(t,null,{default:(0,r.k6)((()=>[(0,r.bF)(o,{type:"primary",style:{width:"100%","text-align":"center"},onClick:a},{default:(0,r.k6)((()=>u[4]||(u[4]=[(0,r.eW)(" 注册 ")]))),_:1})])),_:1})])),_:1},8,["model"])])),_:1})])),_:1})])),_:1})}}},d=a(6262);const c=(0,d.A)(s,[["__scopeId","data-v-c0bc2226"]]);var i=c},2169:function(e,l){let a;a="https://tender-secure-bluegill.ngrok-free.app",l.A=a}}]);
//# sourceMappingURL=514.530ce399.js.map