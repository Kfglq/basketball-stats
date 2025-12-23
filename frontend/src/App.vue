<!-- src/App.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import {
  NConfigProvider,
  darkTheme,
  zhTW,
  dateZhTW,
} from 'naive-ui';
import { useCommonStore } from './stores';

const commonStore = useCommonStore();
const locale = zhTW;
const dateLocale = dateZhTW;

const theme = computed(() => commonStore.darkTheme ? darkTheme : null);
const themeOverrides = computed(() => ({
  common: {
    primaryColor: commonStore.primaryColor,
    primaryColorHover: commonStore.primaryColor + 'cc',
    primaryColorPressed: commonStore.primaryColor + '99',
    bodyColor: commonStore.darkTheme ? '#242424' : '#fafafa',
  },
}));
const scrollbarThumbColor = computed(() => {
  return commonStore.darkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
});
</script>

<template>
  <n-config-provider :locale="locale" :date-locale="dateLocale" :theme="theme" :theme-overrides="themeOverrides">
    <div
      :class="['app-wrapper', 'vhw-100', { 'dark-mode': commonStore.darkTheme }]"
      :style="{ '--scrollbar-thumb-color': scrollbarThumbColor }"
    >
      <router-view />
    </div>
  </n-config-provider>
</template>

<style lang="scss">
.app-wrapper {
  transition: background-color 0.3s ease;
  color: #18181c;
  background-color: #fff;
}

.app-wrapper.dark-mode {
  color: #fff;
  background-color: #18181c;
}

* {
  &::-webkit-scrollbar {
    width: 8px; /* 設置滾動條寬度 */
    height: 8px; /* 設置滾動條高度 */
  }

  /* 軌道：設置為透明 */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 拖動塊：默認透明 */
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }
}

*:hover {
  &::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb-color);
  }
}
</style>
