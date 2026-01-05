// src/stores/actions/Team.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('@/stores/service/Team', () => ({
  call_AllTeams_List: vi.fn(),
  call_SingleTeamById_Data: vi.fn(),
}));

import { call_AllTeams_List, call_SingleTeamById_Data } from '@/stores/service/Team';
import { Team_actions } from './Team';
import { useTeamStore, useCommonStore } from '@/stores';

describe('Team Actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('load_AllTeams_List 成功時，應更新 TeamStore 並關閉 Loading', async () => {
    const teamStore = useTeamStore();
    const commonStore = useCommonStore();

    const mockTeams = [
      { teamId: 'LAL', teamEnName: 'Lakers', teamTwName: '湖人' },
      { teamId: 'GSW', teamEnName: 'Warriors', teamTwName: '勇士' }
    ];

    vi.mocked(call_AllTeams_List).mockResolvedValue({ result: mockTeams } as any);

    await Team_actions.load_AllTeams_List();

    expect(call_AllTeams_List).toHaveBeenCalledTimes(1);
    expect(teamStore.allTeams).toEqual(mockTeams);
    expect(commonStore.isLoading).toBe(false);
    expect(commonStore.error).toBeNull();
  });

  it('load_SingleTeamById_Data 成功時，應更新 TeamStore 中的單一球隊資訊', async () => {
    const teamStore = useTeamStore();
    const commonStore = useCommonStore();

    const mockSingleTeam = { 
      teamId: 'BOS', 
      teamEnName: 'Celtics', 
      roster: [{ playerId: 'tatum01', name: 'Jayson Tatum' }] 
    };

    vi.mocked(call_SingleTeamById_Data).mockResolvedValue({ result: mockSingleTeam } as any);

    await Team_actions.load_SingleTeamById_Data({ id: 'BOS' });

    expect(call_SingleTeamById_Data).toHaveBeenCalledWith({ id: 'BOS' });
    expect(teamStore.singleTeam).toEqual(mockSingleTeam);
    expect(commonStore.isLoading).toBe(false);
    expect(commonStore.error).toBeNull();
  });

  it('load_SingleTeamById_Data 失敗且無 message 時，應顯示預設訊息', async () => {
    const commonStore = useCommonStore();
    
    vi.mocked(call_SingleTeamById_Data).mockRejectedValueOnce({}); 

    try {
      await Team_actions.load_SingleTeamById_Data({ id: 'any-id' });
    } catch (e) {}

    expect(commonStore.error).toBe('載入單一球隊資料失敗');
    expect(commonStore.isLoading).toBe(false);
  });
  

  it('當 API 拋出沒有 message 的錯誤時，應顯示預設錯誤訊息', async () => {
    const commonStore = useCommonStore();
    vi.mocked(call_AllTeams_List).mockRejectedValueOnce({}); 

    try {
      await Team_actions.load_AllTeams_List();
    } catch (e) {
    }

    expect(commonStore.error).toBe('載入球隊資料失敗');
  });
});
