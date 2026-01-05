<!-- src/pages/Team/Team.vue -->
<script setup lang="ts">
import { h, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NFlex, NImage, NText, NTabs, NTabPane, NDataTable, DataTableColumn } from 'naive-ui';
import _ from 'lodash';
import Badge from '@/components/Badge.vue';
import { Team_actions } from '@/stores/actions/Team';
import { useCommonStore, useTeamStore } from '@/stores';
import { playerBasic } from '@/types/stores/Player';

const route = useRoute();
const router = useRouter();
const { load_SingleTeamById_Data } = Team_actions;
const commonStore = useCommonStore();
const teamStore = useTeamStore();
const teamId = computed(() => route.params.id as string);
const teamData = computed(() => _.find(teamStore.allTeams, { teamId: teamId.value }) || {});
const titleColor = computed(() => ( _.get(commonStore,"darkTheme") ? '#fff' : _.get(teamData.value, 'teamColor') ));

watch(teamId, (newId) => {
  load_SingleTeamById_Data({ id: newId });
}, { immediate: true });

const columns: DataTableColumn<playerBasic>[] = [
  { title: '名稱', key: 'name', className: 'text-lg fw-600' },
  { title: '位置', key: 'position', className: 'text-lg fw-600' },
  { title: 'overall', key: 'overall', 
    render(row: playerBasic) {
      return h(Badge, { data: Number(_.get(row, 'overall')), type: 'special' });
    }
  },
]

const rowProps = (row: playerBasic) => ({
  style: 'cursor: pointer;',
  onClick: () => router.push({ name: 'Player', params: { playerId: row.playerId } }),
})

const getImageUrl = (id: string | undefined) => {
  if (!id) return '';
  return new URL(`/src/assets/teams/${id}.svg`, import.meta.url).href;
}
</script>

<template>
  <div class="team">
    <n-card>
      <n-flex class="p-20 mb-20" :align="'center'">
        <n-image width="200" :src="getImageUrl(_.get(teamData, 'teamId', ''))"/>
        <n-flex class="ml-40" :justify="'center'" vertical>
          <n-text class="title-xl" :style="{color: titleColor}">{{ _.get(teamData, 'teamEnName') }}</n-text>
          <n-text class="text-lg fw-500 pl-20">分區：{{ _.get(teamData, 'conferenceName') }}</n-text>
          <n-text class="text-lg fw-500 pl-20">分組：{{ _.get(teamData, 'divisionName') }}</n-text>
          <n-text class="text-lg fw-500 pl-20">縮寫：{{ _.get(teamData, 'teamId') }}</n-text>
        </n-flex>
      </n-flex>
      <n-tabs
        size="large"
        animated
        default-value="roster"
      >
        <n-tab-pane name="roster" tab="陣容名單">
          <n-data-table
            class="roster-table"
            :columns="columns"
            :data="_.get(teamStore, 'singleTeam.roster', [])"
            :bordered="false"
            :row-props="rowProps"
          />
        </n-tab-pane>
        <n-tab-pane name="lineUp" tab="上場時間">
          
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.team {
  min-height: calc(100vh - 80px);
}
</style>
