<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="loginName">
      <el-input v-model="loginForm.loginName" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon"><user /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="passwd">
      <el-input type="password" v-model="loginForm.passwd" placeholder="密码：123456" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon"><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input placeholder="验证码" style="width: 67%" v-model="loginForm.captcha">
        <template #prefix>
          <el-icon class="el-input__icon">
            <Discount />
          </el-icon>
        </template>
      </el-input>
      <div class="login-code">
        <img :src="codeUrl" @click="getCode" alt="" />
      </div>
      <el-checkbox style="margin: 0" v-model="loginForm.rememberMe"> 记住我</el-checkbox>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { getCodeImg } from "@/api/modules/login";
import cookies from "js-cookie";
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  loginName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "change" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  loginName: "",
  passwd: "",
  captcha: "",
  captchaKey: "",
  rememberMe: false
});
const codeUrl = ref("");
const cookiePass = ref("");
const getCode = async () => {
  const { data } = await getCodeImg();
  codeUrl.value = data.base64;
  loginForm.captchaKey = data.keyCode;
};
// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi(loginForm);
      userStore.setUserInfo(data);
      if (loginForm.rememberMe) {
        cookies.set("loginName", loginForm.loginName, { expires: 1 });
        cookies.set("passwd", loginForm.passwd, { expires: 1 });
      }
      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.closeMultipleTab();
      keepAliveStore.setKeepAliveName();

      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 Geeker-Admin",
        type: "success",
        duration: 3000
      });
    } finally {
      await getCode();
      loading.value = false;
    }
  });
};
const getCookie = () => {
  const loginName = cookies.get("loginName");
  let passwd = cookies.get("passwd");
  const rememberMe = cookies.get("rememberMe");
  cookiePass.value = passwd === undefined ? "" : passwd;
  passwd = passwd === undefined ? loginForm.passwd : passwd;
  loginForm.loginName = loginName === undefined ? loginForm.loginName : loginName;
  loginForm.passwd = passwd;
  loginForm.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe);
};
getCookie();
getCode();
// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
