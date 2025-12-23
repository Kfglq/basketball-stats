<!-- src/pages/Player/Player.vue -->
<script setup lang="ts">
import { h, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NCard, NFlex, NImage, NText, NTabs, NTabPane, NDataTable, DataTableColumn } from 'naive-ui';
import _ from 'lodash';
import Badge from '@/components/Badge.vue';
import { Player_actions } from '@/stores/actions/Player';
import { usePlayerStore } from '@/stores';

const route = useRoute();
const { load_PlayerById_Data } = Player_actions;
const playerStore = usePlayerStore();
const playerId = computed(() => route.params.playerId as string);

watch(playerId, (newId) => {
  load_PlayerById_Data({ player_id: newId });
}, { immediate: true });
</script>

<template>
  <div class="player">
    <n-card>
      <n-flex class="px-40 py-20" :justify="'center'" vertical>
        <n-text class="title">{{ _.get(playerStore, 'playerData.name') }}</n-text>
        <n-text class="text-lg fw-500">球隊：{{ _.get(playerStore, 'playerData.team') }}</n-text>
        <n-text class="text-lg fw-500">位置：{{ _.get(playerStore, 'playerData.position') }}</n-text>
      </n-flex>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.player {
  min-height: calc(100vh - 80px);
}
</style>
