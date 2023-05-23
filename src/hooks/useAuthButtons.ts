import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

/**
 * @description 页面按钮权限
 * */
export const useAuthButtons = () => {
  const route = useRoute();
  const authStore = useAuthStore();
  let authButtons: string[] = [];
  if (authStore.authButtonListGet[authStore.routeName]) {
    authButtons = [...authStore.authButtonListGet[route.name as string], ...authStore.authRoles] || [];
  } else {
    authButtons = [...authStore.authRoles] || [];
  }
  const BUTTONS = computed(() => {
    let currentPageAuthButton: { [key: string]: boolean } = {};
    authButtons.forEach(item => (currentPageAuthButton[item] = true));
    return currentPageAuthButton;
  });

  return {
    BUTTONS
  };
};
