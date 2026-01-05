// src/components/ChangeTopicColor.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import ChangeTopicColor from './ChangeTopicColor.vue';
import { useCommonStore } from '@/stores';

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>();
  return {
    ...actual,
    NFlex: { name: 'NFlex', props: ['align', 'justify'], template: '<div class="mock-flex"><slot /></div>' },
    NTooltip: { name: 'NTooltip', template: '<div><slot name="trigger" /><slot /></div>' },
    NButton: { 
      name: 'NButton', 
      props: ['size', 'type'], 
      template: '<button @click="$emit(\'click\', $event)"><slot /></button>' 
    },
    NPopover: { 
      name: 'NPopover', 
      props: ['show'], 
      emits: ['update:show'],
      template: `
        <div class="popover-root">
          <div class="popover-trigger" @click="$emit('update:show', !show)"><slot name="trigger" /></div>
          <div v-if="show" class="mock-popover">
            <div class="popover-header"><slot name="header" /></div>
            <div class="popover-body"><slot /></div>
          </div>
        </div>
      ` 
    },
    NColorPicker: { 
      name: 'NColorPicker', 
      props: ['value'], 
      template: '<input class="mock-color-picker" :value="value" @input="$emit(\'update:value\', $event.target.value)" />' 
    }
  };
});

vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: { name: 'FontAwesomeIcon', template: '<i></i>' }
}));

describe('ChangeTopicColor.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('點擊主題按鈕應觸發 store 的 toggleTheme', async () => {
    const commonStore = useCommonStore();
    const toggleSpy = vi.spyOn(commonStore, 'toggleTheme');
    const wrapper = mount(ChangeTopicColor, {
      global: { stubs: { 'font-awesome-icon': true } }
    });

    const themeBtn = wrapper.findAll('button')[0];
    await themeBtn.trigger('click');

    expect(toggleSpy).toHaveBeenCalled();
  });

  it('顏色選擇器的確認邏輯：點擊確認後應更新 Store 並關閉 Popover', async () => {
    const commonStore = useCommonStore();
    const setPrimarySpy = vi.spyOn(commonStore, 'setPrimaryColor');
    const wrapper = mount(ChangeTopicColor, {
      global: { stubs: { 'font-awesome-icon': true } }
    });

    const paletteTrigger = wrapper.find('.popover-trigger');
    await paletteTrigger.trigger('click'); 
    await nextTick();
    await nextTick();

    const colorPicker = wrapper.getComponent({ name: 'NColorPicker' });
    const newColor = '#ff0000';
    await colorPicker.vm.$emit('update:value', newColor);

    const confirmBtn = wrapper.findAll('button').find(b => b.text().includes('確認'));
    await confirmBtn?.trigger('click');
    await nextTick();

    expect(setPrimarySpy).toHaveBeenCalledWith(newColor);
    const popover = wrapper.getComponent({ name: 'NPopover' });
    expect(popover.props('show')).toBe(false);
  });

  it('顏色選擇器的取消邏輯：點擊取消後不應更新 Store', async () => {
    const commonStore = useCommonStore();
    commonStore.primaryColor = '#18a058';
    const setPrimarySpy = vi.spyOn(commonStore, 'setPrimaryColor');
    const wrapper = mount(ChangeTopicColor, {
      global: { stubs: { 'font-awesome-icon': true } }
    });

    await wrapper.findAll('button')[1].trigger('click');
    await nextTick();

    const colorPicker = wrapper.getComponent({ name: 'NColorPicker' });
    await colorPicker.vm.$emit('update:value', '#000000');
    await nextTick();

    const buttons = wrapper.findAll('button');
    const cancelBtn = buttons.find(b => b.text().includes('取消'));
    await cancelBtn?.trigger('click');
    await nextTick();

    expect(setPrimarySpy).not.toHaveBeenCalled();
    const popover = wrapper.getComponent({ name: 'NPopover' });
    expect(popover.props('show')).toBe(false);
  });

  it('應該正確接收並應用 Props', () => {
    const wrapper = mount(ChangeTopicColor, {
      props: {
        buttonSize: 'tiny',
        flexAlign: 'end'
      },
      global: { stubs: { 'font-awesome-icon': true } }
    });

    const flex = wrapper.getComponent({ name: 'NFlex' });
    const button = wrapper.getComponent({ name: 'NButton' });

    expect(flex.props('align')).toBe('end');
    expect(button.props('size')).toBe('tiny');
  });

  it('themeIcon 應隨 darkTheme 切換（覆蓋 computed 邏輯）', async () => {
    const commonStore = useCommonStore();
    commonStore.darkTheme = false;
    const wrapper = mount(ChangeTopicColor, {
      global: { 
        stubs: { 
          'font-awesome-icon': {
            name: 'FontAwesomeIcon',
            props: ['icon'],
            template: '<i :class="icon.iconName"></i>'
          } 
        } 
      }
    });
    let icon = wrapper.find('i');
    expect(icon.attributes('class')).toBe('moon');
    commonStore.darkTheme = true;
    await nextTick();
    icon = wrapper.find('i');
    expect(icon.attributes('class')).toBe('sun');
  });
});
