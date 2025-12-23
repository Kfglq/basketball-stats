<!-- src/pages/Auth/Login.vue -->
<script setup lang="ts">
import { NFlex, NText, NButton } from 'naive-ui';
import ChangeTopicColor from '@/components/ChangeTopicColor.vue';
</script>

<template>
  <div class="login">
    <n-flex vertical>
      <n-text class="title mb-20">歡迎使用</n-text>
        <ChangeTopicColor />
      <n-button class="mt-20" size="large" type="primary" @click="$router.push({ name: 'Home' })">進入首頁</n-button>
    </n-flex>
  </div>
</template>

<style lang="scss" scoped>
.login{
}
</style>
