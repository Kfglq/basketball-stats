<!-- src/pages/A/Index.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useAStore, useBStore, useCommonStore } from '@/stores';

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  a
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
</style>
