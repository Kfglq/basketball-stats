// src/layouts/MainLayout.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import MainLayout from './MainLayout.vue';
import { useTeamStore } from '@/stores';
import { Team_actions } from '@/stores/actions/Team';

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>();
  return {
    ...actual,
    NLayout: { name: 'NLayout', template: '<div><slot /></div>' },
    NLayoutSider: { 
      name: 'NLayoutSider',
      props: ['collapsed'], 
      template: '<div class="mock-sider"><slot /></div>' 
    },
    NLayoutContent: { name: 'NLayoutContent', template: '<main><slot /></main>' },
    NList: { name: 'NList', template: '<ul><slot /></ul>' },
    NListItem: { name: 'NListItem', template: '<li><slot /></li>' },
    NFlex: { 
      name: 'NFlex', 
      template: '<div class="mock-flex" @click="$emit(\'click\', $event)"><slot /></div>' 
    },
    NImage: { name: 'NImage', props: ['src'], template: '<img :src="src" />' },
    NText: { name: 'NText', template: '<span><slot /></span>' },
  };
});

vi.mock('@/components/ChangeTopicColor.vue', () => ({
  default: { name: 'ChangeTopicColor', props: ['buttonSize'], template: '<div class="color-picker"></div>' }
}));

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.spyOn(Team_actions, 'load_AllTeams_List').mockImplementation(async () => {});

describe('MainLayout.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mockTeams = [
    { teamId: 'BOS', teamEnName: 'Celtics', teamTwName: '塞爾提克', teamColor: '#007A33', conferenceName: 'E', divisionName: 'A' },
    { teamId: 'GSW', teamEnName: 'Warriors', teamTwName: '勇士', teamColor: '#1D428A', conferenceName: 'W', divisionName: 'P' }
  ];

  const mountOptions = {
    global: {
      stubs: { 'router-view': true },
      mocks: { $router: { push: mockPush } }
    }
  };

  it('掛載時應呼叫 load_AllTeams_List 並渲染球隊列表', async () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams(mockTeams);
    const wrapper = mount(MainLayout, mountOptions);
    expect(wrapper.text()).toContain('Celtics');
  });

  it('點擊 NBA Logo 應跳轉至 Home 頁面', async () => {
    const wrapper = mount(MainLayout, mountOptions);
    const nbaSpan = wrapper.findAll('span').find(s => s.text() === 'NBA');
    await nbaSpan?.trigger('click');

    expect(mockPush).toHaveBeenCalledWith({ name: 'Home' });
  });

  it('點擊球隊項目應跳轉至該球隊詳情頁', async () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams(mockTeams);
    const wrapper = mount(MainLayout, mountOptions);
    
    const teamItem = wrapper.findAll('.mock-flex').find(f => f.text().includes('Warriors'));
    await teamItem?.trigger('click');

    expect(mockPush).toHaveBeenCalledWith({
      name: 'Team',
      params: { id: 'GSW' }
    });
  });

  it('當側邊欄收合時，應透過 v-show 隱藏文字', async () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams(mockTeams);
    const wrapper = mount(MainLayout, mountOptions);
    
    const nbaText = wrapper.findAll('span').find(s => s.text() === 'NBA');
    expect(nbaText?.element.style.display).not.toBe('none');
    const sider = wrapper.getComponent({ name: 'NLayoutSider' });
    await sider.vm.$emit('update:collapsed', true);
    await nextTick();
    expect(nbaText?.element.style.display).toBe('none');
  });
});
