<!-- src/pages/Home.vue -->
<script setup lang="ts">
import { h } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NFlex, NImage, NText, NDataTable, DataTableColumn } from 'naive-ui';
import _ from 'lodash';
import { useTeamStore, useCommonStore } from '@/stores';
import { teams } from '@/types/stores/Team';

const router = useRouter();
const teamStore = useTeamStore();
const commonStore = useCommonStore();
const columns: DataTableColumn<teams>[] = [
  {
    title: 'Teams', key: 'Teams',
    render(row: teams) {
      const teamId = _.get(row, 'teamId');
      const teamIcon = teamId 
        ? new URL(`/src/assets/teams/${teamId}.svg`, import.meta.url).href 
        : '';
      const teamName = _.get(row, 'teamEnName');
      const isDarkTheme = _.get(commonStore,"darkTheme");
      const teamColor = isDarkTheme?'#fff':_.get(row, 'teamColor');
      return h(
        NFlex,{ align: 'center', wrap: false, onClick: () => { router.push({ name: 'Team', params: { id: _.get(row, 'teamId') } }) } },
        [
          h(NImage, { src: teamIcon, width: 24, previewDisabled: true, style: { marginRight: '8px' } }),
          h(NText, { class: 'text-lg fw-600', style: { color: teamColor }}, { default: () => teamName }),
        ]
      );
    }
  },
  { title: 'teamId', key: 'teamId', className: 'text-lg fw-600' },
]
</script>

<template>
  <div class="home hw-100">
    <n-card title="Teams">
      <n-flex :align="'center'" :justify="'space-between'">
        <div class="team-box">
          <n-flex class="conference title-xs color-white bg-east py-4" :justify="'center'">Eastern</n-flex>
          <n-data-table
            class="team-table-east"
            :columns="columns"
            :data="_.filter(_.get(teamStore,'allTeams'),{ conferenceName: 'Eastern'})"
            :bordered="false"
          />
        </div>
        <div class="team-box">
          <n-flex class="conference title-xs color-white bg-west py-4" :justify="'center'">Western</n-flex>
          <n-data-table
            class="team-table-west"
            :columns="columns"
            :data="_.filter(_.get(teamStore,'allTeams'),{ conferenceName: 'Western'})"
            :bordered="false"
          />
        </div>
      </n-flex>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.home {
  .conference{
    border-radius: 15px 15px 0 0;
  }
  .team-box{
    width: 49%;
  }
  .team-table-east{
    border: 1px solid var(--color-east);
  }
  .team-table-west{
    border: 1px solid var(--color-west);
  }
}
</style>
