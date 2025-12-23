<!-- src/layouts/AuthLayout.vue -->
<script setup lang="ts">
import { NFlex } from 'naive-ui';
</script>

<template>
  <div class="auth-layout vhw-100">
    <n-flex class="hw-100" :align="'center'" :justify="'center'">
      <router-view />
    </n-flex>
  </div>
</template>

<style lang="scss" scoped>
</style>