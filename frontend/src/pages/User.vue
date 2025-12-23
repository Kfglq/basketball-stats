<!-- src/pages/User.vue -->
<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();

console.log('當前用戶 ID 是:', props.id);
</script>

<template>
  user id: {{ id }}
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
