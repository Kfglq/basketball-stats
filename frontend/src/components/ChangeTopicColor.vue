<!-- src/components/ChangeTopicColor.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { NFlex, NTooltip, NButton, NPopover, NColorPicker } from 'naive-ui';
import { faSun, faMoon, faPalette } from '@fortawesome/free-solid-svg-icons';
import { useCommonStore } from '@/stores';
import { changeTopicColorProps } from '@/types/components/ChangeTopicColor';

const props = withDefaults(defineProps<changeTopicColorProps>(), {
  flexAlign: 'center',
  flexJustify: 'space-around',
  buttonSize: 'large',
});

const commonStore = useCommonStore();
const themeIcon = computed(() => commonStore.darkTheme ? faSun : faMoon);
const showColorPopover = ref(false);
const tempPrimaryColor = ref(commonStore.primaryColor);

const handleColorConfirm = () => {
  console.log(tempPrimaryColor.value);
  commonStore.setPrimaryColor(tempPrimaryColor.value);
  showColorPopover.value = false;
};

const handleColorCancel = () => {
  tempPrimaryColor.value = commonStore.primaryColor; 
  showColorPopover.value = false;
};
</script>

<template>
  <div class="changeTopicColor">
    <n-flex :align="props.flexAlign" :justify="props.flexJustify">
      <n-tooltip>
        <template #trigger>
          <n-button circle :size="props.buttonSize" type="info" secondary @click="commonStore.toggleTheme()">
            <font-awesome-icon :icon="themeIcon" />
          </n-button>
        </template>
        切換主題
      </n-tooltip>
      <n-popover trigger="click" placement="right" :show-arrow="true" v-model:show="showColorPopover">
        <template #header>更換主色</template>
        <template #trigger>
          <n-button circle type="primary" secondary :size="props.buttonSize">
            <font-awesome-icon :icon="faPalette" />
          </n-button>
        </template>
        <template #default>
          <div class="color-picker-content" style="width: 240px;">
            <n-color-picker v-model:value="tempPrimaryColor" :swatches="['#18a058', '#2080f0', '#f0a000', '#d03050', '#70c0e8']" :modes="['hex']"/>
            <n-flex justify="end" class="mt-8">
              <n-button size="small" @click="handleColorCancel">取消</n-button>
              <n-button size="small" type="primary" @click="handleColorConfirm">確認</n-button>
            </n-flex>
          </div>
        </template>
      </n-popover>
    </n-flex>
  </div>
</template>

<style lang="scss" scoped>
.changeTopicColor{
}
</style>
