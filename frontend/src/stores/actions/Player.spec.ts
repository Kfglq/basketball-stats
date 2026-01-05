// src/stores/actions/Player.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('@/stores/service/Player', () => ({
  call_PlayerById_Data: vi.fn()
}));

import { call_PlayerById_Data } from '@/stores/service/Player';
import { Player_actions } from './Player';
import { usePlayerStore, useCommonStore } from '@/stores';

describe('Player Actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('load_PlayerById_Data 成功時應透過 PlayerStore 存入資料', async () => {
    const playerStore = usePlayerStore();
    const commonStore = useCommonStore();
    const mockPlayerResult = { playerId: 'LBJ001', name: 'LeBron James' };
    
    vi.mocked(call_PlayerById_Data).mockResolvedValue({ result: mockPlayerResult } as any);

    await Player_actions.load_PlayerById_Data({ player_id: 'LBJ001' });

    expect(call_PlayerById_Data).toHaveBeenCalledWith({ player_id: 'LBJ001' });
    expect(playerStore.playerData).toEqual(mockPlayerResult);
    expect(commonStore.isLoading).toBe(false);
    expect(commonStore.error).toBeNull();
  });

  it('當 API 報錯時，應更新 commonStore 的 error 狀態', async () => {
    const commonStore = useCommonStore();
    
    vi.mocked(call_PlayerById_Data).mockRejectedValue(new Error('API 異常'));

    try {
      await Player_actions.load_PlayerById_Data({ player_id: 'error_id' });
    } catch (e) {}

    expect(commonStore.error).toBe('API 異常');
    expect(commonStore.isLoading).toBe(false);
  });
  
  it('當 API 報錯且沒有 message 時，應顯示預設錯誤訊息', async () => {
    const commonStore = useCommonStore();

    vi.mocked(call_PlayerById_Data).mockRejectedValueOnce({}); 

    try {
      await Player_actions.load_PlayerById_Data({ player_id: 'test' });
    } catch (e) {}

    expect(commonStore.error).toBe('載入球員資料失敗');
  });
});