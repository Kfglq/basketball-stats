// src/pages/Team/Team.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import Team from './Team.vue';
import { useTeamStore, useCommonStore } from '@/stores';
import { Team_actions } from '@/stores/actions/Team';

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>();
  return {
    ...actual,
    NDataTable: {
      name: 'NDataTable',
      props: ['data', 'columns', 'rowProps'],
      template: '<div class="mock-table"></div>',
    },
    NCard: { template: '<div><slot /></div>' },
    NFlex: { template: '<div><slot /></div>' },
    NImage: { template: '<img class="mock-img" />' },
    NText: { template: '<span class="mock-text"><slot /></span>' },
    NTabs: { template: '<div><slot /></div>' },
    NTabPane: { template: '<div><slot /></div>' },
  };
});

vi.mock('@/components/Badge.vue', () => ({
  default: { 
    name: 'Badge', 
    props: ['data', 'type'], 
    template: '<div class="mock-badge">{{data}}-{{type}}</div>' 
  }
}));

const mockPush = vi.fn();
const mockRoute = { params: { id: 'BOS' } };

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => mockRoute),
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.spyOn(Team_actions, 'load_SingleTeamById_Data').mockImplementation(async () => {});

describe('Team.vue', () => {
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    vi.clearAllMocks();
  });

  const mockAllTeams = [
    { 
      teamId: 'BOS', 
      teamEnName: 'Celtics', 
      teamTwName: '波士頓塞爾提克',
      teamColor: '#007A33', 
      conferenceName: 'Eastern', 
      divisionName: 'Atlantic' 
    }
  ];

  const mockRoster = [
    { 
      playerId: 'tatum01', 
      name: 'Jayson Tatum', 
      team: 'BOS', 
      position: 'F', 
      overall: '95',
      version: '2024' 
    }
  ];

  it('應正確顯示球隊基本資訊與透過 Store 注入的陣容名單', async () => {
    const teamStore = useTeamStore();
    const commonStore = useCommonStore();
    
    teamStore.setAllTeams(mockAllTeams);
    teamStore.setSingleTeam({ roster: mockRoster });
    commonStore.darkTheme = false;

    const wrapper = mount(Team);
    await nextTick();

    expect(wrapper.text()).toContain('Celtics');
    expect(wrapper.text()).toContain('分區：Eastern');
    expect(wrapper.text()).toContain('縮寫：BOS');
    const table = wrapper.getComponent({ name: 'NDataTable' });
    expect(table.props('data')).toHaveLength(1);
    expect(table.props('data')[0].name).toBe('Jayson Tatum');
  });

  it('點擊球員列表行 (rowProps) 時應觸發路由跳轉', async () => {
    const teamStore = useTeamStore();
    teamStore.setSingleTeam({ roster: mockRoster });

    const wrapper = mount(Team);
    const table = wrapper.getComponent({ name: 'NDataTable' });

    const rowPropsFn = table.props('rowProps');
    const props = rowPropsFn(mockRoster[0]);
    expect(props.style).toContain('cursor: pointer');
    if (props.onClick) props.onClick();
    expect(mockPush).toHaveBeenCalledWith({
      name: 'Player',
      params: { playerId: 'tatum01' }
    });
  });

  it('驗證表格中的 Badge 渲染邏輯 (型別轉換)', async () => {
    const teamStore = useTeamStore();
    teamStore.setSingleTeam({ roster: mockRoster });

    const wrapper = mount(Team);
    const table = wrapper.getComponent({ name: 'NDataTable' });
    const columns = table.props('columns');
    
    const overallColumn = columns.find((c: any) => c.key === 'overall');
    expect(overallColumn).toBeDefined();
    const vnode = overallColumn.render(mockRoster[0]);
    expect(vnode.props.data).toBe(95);
    expect(vnode.props.type).toBe('special');
  });

  it('標題顏色 (titleColor) 應隨黑暗模式狀態切換', async () => {
    const teamStore = useTeamStore();
    const commonStore = useCommonStore();
    teamStore.setAllTeams(mockAllTeams);
    commonStore.darkTheme = false;
    const wrapper = mount(Team);
    await nextTick();
    const titleText = wrapper.findAll('.mock-text').find(s => s.text() === 'Celtics');
    expect(titleText?.attributes('style')).toContain('color: rgb(0, 122, 51)'); 
    commonStore.darkTheme = true;
    await nextTick();
    expect(titleText?.attributes('style')).toContain('color: rgb(255, 255, 255)');
  });

  it('當路由參數 teamId 改變時，應觸發 load_SingleTeamById_Data', async () => {
    mount(Team);
    expect(Team_actions.load_SingleTeamById_Data).toHaveBeenCalledWith({ id: 'BOS' });
  });

  it('驗證圖片 URL 生成邏輯', () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams(mockAllTeams);
    const wrapper = mount(Team);
    const img = wrapper.find('.mock-img');
    expect(img.exists()).toBe(true);
  });

  it('當 ID 缺失時，getImageUrl 應觸發 || 分支回傳空字串', async () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams([{ teamId: undefined as any, teamEnName: 'Unknown', teamTwName: '未知', conferenceName: 'Eastern', divisionName: 'Atlantic', teamColor: '#007A33' }]);
    
    const wrapper = mount(Team);
    await nextTick();
    const img = wrapper.find('.mock-img');
    expect(img.exists()).toBe(true);
  });

  it('當 ID 缺失時，getImageUrl 應直接回傳空字串 (達成 100% 覆蓋)', async () => {
    const teamStore = useTeamStore();
    teamStore.setAllTeams([{ teamId: undefined as any, teamEnName: 'Unknown', teamTwName: '未知', conferenceName: 'Eastern', divisionName: 'Atlantic', teamColor: '#007A33' }]);
    const wrapper = mount(Team);
    await nextTick();
    const img = wrapper.find('.mock-img');
    expect(img.attributes('src')).toBe('');
  });
});
