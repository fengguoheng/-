"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[401],{4114:function(e,t,r){var n=r(6518),a=r(8981),l=r(6198),o=r(4527),s=r(6837),i=r(9039),u=i((function(){return 4294967297!==[].push.call({length:4294967296},1)})),c=function(){try{Object.defineProperty([],"length",{writable:!1}).push()}catch(e){return e instanceof TypeError}},d=u||!c();n({target:"Array",proto:!0,arity:1,forced:d},{push:function(e){var t=a(this),r=l(t),n=arguments.length;s(r+n);for(var i=0;i<n;i++)t[r]=arguments[i],r++;return o(t,r),r}})},4376:function(e,t,r){var n=r(2195);e.exports=Array.isArray||function(e){return"Array"===n(e)}},4527:function(e,t,r){var n=r(3724),a=r(4376),l=TypeError,o=Object.getOwnPropertyDescriptor,s=n&&!function(){if(void 0!==this)return!0;try{Object.defineProperty([],"length",{writable:!1}).length=1}catch(e){return e instanceof TypeError}}();e.exports=s?function(e,t){if(a(e)&&!o(e,"length").writable)throw new l("Cannot set read only .length");return e.length=t}:function(e,t){return e.length=t}},6401:function(e,t,r){r.r(t),r.d(t,{default:function(){return h}});r(4114);var n=r(641),a=r(953),l=r(33),o=r(810),s=r(4335),i=r(2169);const u=(0,o.nY)("login",{state:()=>({form:{username:"",password:""},message:"",loginError:!1,email:"",isLoggedIn:!1}),actions:{async sqlLogin(){try{const e=await s.A.post(`${i.A}/api/sqlLogin`,{username:this.form.username,password:this.form.password},{withCredentials:!0});return"SQL 数据库登录成功"===e.data.message?(this.loginError=!1,this.message=e.data.message,this.email=e.data.email,this.isLoggedIn=e.data.b,console.log(this.isLoggedIn),localStorage.setItem("isLoggedIn",this.isLoggedIn),localStorage.setItem("email",this.email),localStorage.setItem("username",e.data.username),localStorage.setItem("id",e.data.id),!0):(this.loginError=!0,this.message=e.data.message,!1)}catch(e){return this.message="SQL 登录失败",!1}}}});var c=r(5220);const d={class:"login-container"};var g={__name:"UserLogin",emits:["login-success"],setup(e,{emit:t}){const r=u(),o=t,s=(0,a.KR)(null),g=(0,c.rd)(),m=async()=>{const e=await r.sqlLogin();e&&(o("login-success"),g.push("/home"))},f=()=>{window.location.href=`${i.A}/auth/github`},h=()=>{g.push("/register")},p=async()=>{g.push({name:"vistor"})};return(e,t)=>{const o=(0,n.g2)("el-input"),i=(0,n.g2)("el-form-item"),u=(0,n.g2)("el-button"),c=(0,n.g2)("el-form"),g=(0,n.g2)("el-card");return(0,n.uX)(),(0,n.CE)("div",d,[(0,n.bF)(g,{class:"login-card"},{header:(0,n.k6)((()=>t[2]||(t[2]=[(0,n.Lk)("h2",null,"博客系统",-1)]))),default:(0,n.k6)((()=>[(0,n.bF)(c,{model:(0,a.R1)(r).form,ref_key:"formRef",ref:s},{default:(0,n.k6)((()=>[(0,n.bF)(i,null,{default:(0,n.k6)((()=>[(0,n.bF)(o,{modelValue:(0,a.R1)(r).form.username,"onUpdate:modelValue":t[0]||(t[0]=e=>(0,a.R1)(r).form.username=e),placeholder:"用户名",class:(0,l.C4)({"error-input":(0,a.R1)(r).loginError})},null,8,["modelValue","class"])])),_:1}),(0,n.bF)(i,null,{default:(0,n.k6)((()=>[(0,n.bF)(o,{modelValue:(0,a.R1)(r).form.password,"onUpdate:modelValue":t[1]||(t[1]=e=>(0,a.R1)(r).form.password=e),placeholder:"密码",type:"password"},null,8,["modelValue"])])),_:1}),(0,n.bF)(i,null,{default:(0,n.k6)((()=>[(0,n.bF)(u,{type:"primary",style:{width:"100%","text-align":"center"},onClick:m},{default:(0,n.k6)((()=>t[3]||(t[3]=[(0,n.eW)("登录")]))),_:1})])),_:1}),(0,n.bF)(i,null,{default:(0,n.k6)((()=>[(0,n.bF)(u,{type:"primary",style:{width:"100%","text-align":"center"},onClick:h},{default:(0,n.k6)((()=>t[4]||(t[4]=[(0,n.eW)("现在去注册")]))),_:1})])),_:1}),(0,n.bF)(i,null,{default:(0,n.k6)((()=>[(0,n.bF)(u,{type:"primary",style:{width:"100%","text-align":"center"},onClick:f},{default:(0,n.k6)((()=>t[5]||(t[5]=[(0,n.eW)("使用 GitHub 登录")]))),_:1})])),_:1}),(0,n.bF)(i,null,{default:(0,n.k6)((()=>[(0,n.bF)(u,{type:"primary",style:{width:"100%","text-align":"center"},onClick:p},{default:(0,n.k6)((()=>t[6]||(t[6]=[(0,n.eW)("游客")]))),_:1})])),_:1})])),_:1},8,["model"]),(0,n.Lk)("p",null,(0,l.v_)((0,a.R1)(r).message),1)])),_:1}),t[7]||(t[7]=(0,n.Lk)("img",{src:"background.jpg",alt:"背景图",class:"bg-image"},null,-1))])}}},m=r(6262);const f=(0,m.A)(g,[["__scopeId","data-v-61ada912"]]);var h=f},6837:function(e){var t=TypeError,r=9007199254740991;e.exports=function(e){if(e>r)throw t("Maximum allowed index exceeded");return e}}}]);
//# sourceMappingURL=401.128cb3a4.js.map