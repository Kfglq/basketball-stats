<!-- src/layouts/MainLayout.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NLayout, NLayoutSider, NLayoutContent, NList, NListItem, NFlex, NImage, NText } from 'naive-ui';
import _ from 'lodash';
import { Team_actions } from '@/stores/actions/Team';
import { useTeamStore } from '@/stores';
import ChangeTopicColor from '@/components/ChangeTopicColor.vue';

const { load_AllTeams_List } = Team_actions;
load_AllTeams_List();
const router = useRouter();
const teamStore = useTeamStore();
const collapsed = ref(false);

const getImageUrl = (name: string) => {
  if(name === 'NBA') {
    return new URL(`/src/assets/${name}.png`, import.meta.url).href;
  }
  return new URL(`/src/assets/teams/${name}.svg`, import.meta.url).href;
};
</script>

<template>
  <div class="main-layout vhw-100">
    <n-layout class="hw-100" has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="60"
        :width="240"
        show-trigger="arrow-circle"
        content-style="padding: 20px;"
        bordered
        :collapsed="collapsed"
        @update:collapsed="collapsed = $event"
      >
        <n-list>
          <n-list-item>
            <n-flex :align="'center'" :justify="'space-between'">
              <n-flex :align="'center'" @click="router.push({ name: 'Home' })">
                <n-image width="20" :preview-disabled="true" :src="getImageUrl('NBA')"/>
                <n-text class="text" v-show="!collapsed">NBA</n-text>
              </n-flex>
              <ChangeTopicColor buttonSize="small" v-show="!collapsed"/>
            </n-flex>
          </n-list-item>
          <n-list-item v-for="team in _.get(teamStore,'allTeams',[])" :key="_.get(team, 'teamId')">
            <n-flex :align="'center'" @click="router.push({ name: 'Team', params: { id: _.get(team, 'teamId')} })">
              <n-image width="20" :src="getImageUrl(_.get(team, 'teamId'))"/>
              <n-text class="text fw-600" v-show="!collapsed">{{ _.get(team, 'teamEnName') }}</n-text>
            </n-flex>
          </n-list-item>
        </n-list>
      </n-layout-sider>
      <n-layout-content class="px-80 py-40">
        <router-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style lang="scss" scoped>
</style>