// src/pages/Home.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import Home from './Home.vue';
import { useTeamStore, useCommonStore } from '@/stores';

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>();
  return {
    ...actual,
    NDataTable: {
      name: 'NDataTable',
      props: ['data', 'columns'],
      template: '<div class="mock-data-table"></div>',
    },
    NCard: { template: '<div><slot /></div>' },
    NFlex: { template: '<div><slot /></div>' },
    NImage: { template: '<div />' },
    NText: { template: '<span><slot /></span>' },
  };
});

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

describe('Home.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mockTeams = [
    {
      teamId: 'LAL',
      teamEnName: 'Lakers',
      teamTwName: '洛杉磯湖人',
      conferenceName: 'Western',
      divisionName: 'Pacific',
      teamColor: '#552583'
    },
    {
      teamId: 'BOS',
      teamEnName: 'Celtics',
      teamTwName: '波士頓塞爾提克',
      conferenceName: 'Eastern',
      divisionName: 'Atlantic',
      teamColor: '#007A33'
    }
  ];

  it('應該根據分區正確過濾資料，並驗證點擊跳轉邏輯', async () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams(mockTeams);

    const wrapper = mount(Home);
    await nextTick();

    const tables = wrapper.findAllComponents({ name: 'NDataTable' });
    const eastTable = tables[0];
    const eastData = eastTable.props('data');

    expect(eastData).toHaveLength(1);
    expect(eastData[0].teamId).toBe('BOS');

    const columns = eastTable.props('columns');
    const teamColumn = columns.find((c: any) => c.key === 'Teams');
    const vnode = teamColumn.render(mockTeams[1]);
    
    if (vnode.props && vnode.props.onClick) {
      vnode.props.onClick();
    }
    expect(mockPush).toHaveBeenCalledWith({ name: 'Team', params: { id: 'BOS' } });
  });

  it('在黑暗模式下，球隊名稱顏色應顯示為白色 (#fff)', async () => {
    const teamStore = useTeamStore();
    const commonStore = useCommonStore();

    teamStore.setAllTeams(mockTeams);
    commonStore.darkTheme = true;

    const wrapper = mount(Home);
    await nextTick();

    const tables = wrapper.findAllComponents({ name: 'NDataTable' });
    const columns = tables[0].props('columns');
    const teamColumn = columns.find((c: any) => c.key === 'Teams');
    const testRow = mockTeams[1]; // Celtics
    const vnode = teamColumn.render(testRow);
    const nTextVNode = vnode.children[1]; 
    expect(nTextVNode.props.style.color).toBe('#fff');
  });

  it('當 teamId 缺失導致路徑生成異常時，teamIcon 應回傳空字串 (覆蓋 || 分支)', async () => {
    const teamStore = useTeamStore();
    const abnormalTeams = [{ teamId: null, teamEnName: 'Unknown', conferenceName: 'Eastern' }];
    teamStore.setAllTeams(abnormalTeams as any);

    const wrapper = mount(Home);
    await nextTick();

    const tables = wrapper.findAllComponents({ name: 'NDataTable' });
    const teamColumn = tables[0].props('columns').find((c: any) => c.key === 'Teams');
    const vnode = teamColumn.render(abnormalTeams[0]);
    const nImageVNode = vnode.children[0];
    expect(nImageVNode.props.src).toBe('');
  });

  it('在一般模式下，應正確渲染球隊顏色並執行 Slot 函數', async () => {
    const teamStore = useTeamStore();
    const commonStore = useCommonStore();
    teamStore.setAllTeams(mockTeams);
    commonStore.darkTheme = false;

    const wrapper = mount(Home);
    await nextTick();

    const tables = wrapper.findAllComponents({ name: 'NDataTable' });
    const teamColumn = tables[0].props('columns').find((c: any) => c.key === 'Teams');
    const vnode = teamColumn.render(mockTeams[1]);
    const nTextVNode = vnode.children[1]; 
    const renderedText = nTextVNode.children.default();
    expect(nTextVNode.props.style.color).toBe('#007A33');
    expect(renderedText).toBe('Celtics');
  });
});
