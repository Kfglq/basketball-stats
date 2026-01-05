// src/pages/Player/Player.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import Player from './Player.vue';
import { usePlayerStore } from '@/stores';
import { Player_actions } from '@/stores/actions/Player';

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>();
  return {
    ...actual,
    NCard: { template: '<div><slot /></div>' },
    NFlex: { template: '<div><slot /></div>' },
    NText: { template: '<span class="mock-text"><slot /></span>' },
  };
});

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: { playerId: 'tatum01' }
  })),
}));

const loadPlayerSpy = vi.spyOn(Player_actions, 'load_PlayerById_Data')
  .mockImplementation(async () => {});

describe('Player.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mockPlayerData = {
    playerId: 'tatum01',
    name: 'Jayson Tatum',
    team: 'BOS',
    position: 'F',
    overall: '95',
    version: '2024'
  };

  it('應在掛載時立即觸發 Action 載入球員資料', () => {
    mount(Player);
    expect(loadPlayerSpy).toHaveBeenCalledWith({ player_id: 'tatum01' });
  });

  it('當 Store 有資料時，應正確渲染球員姓名、球隊與位置', async () => {
    const playerStore = usePlayerStore();
    const wrapper = mount(Player);

    playerStore.setPlayerData(mockPlayerData as any);
    await nextTick();
    expect(wrapper.text()).toContain('Jayson Tatum');
    expect(wrapper.text()).toContain('球隊：BOS');
    expect(wrapper.text()).toContain('位置：F');
  });

  it('若 Store 資料為空，畫面不應崩潰', async () => {
    const playerStore = usePlayerStore();
    playerStore.setPlayerData(null);
    const wrapper = mount(Player);
    await nextTick();
    const titleText = wrapper.find('.title');
    expect(titleText.text()).toBe('');
  });
});
