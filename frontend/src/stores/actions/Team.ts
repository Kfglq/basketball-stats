// src/stores/actions/Team.ts
import { call_AllTeams_List, call_SingleTeamById_Data } from '@/stores/service/Team';
import { useTeamStore, useCommonStore } from '@/stores';
import { loadSingleTeamPayload } from '@/types/stores/Team';

export const Team_actions = {
  async load_AllTeams_List() {
    const TeamStore = useTeamStore();
    const commonStore = useCommonStore();
    commonStore.setLoading(true); 
    commonStore.setError(null);

    try {
      const { result } = await call_AllTeams_List();
      TeamStore.setAllTeams(result); 
    } catch (e: any) {
      commonStore.setError(e.message || '載入球隊資料失敗');
      throw e;
    } finally {
      commonStore.setLoading(false);
    }
  },

  async load_SingleTeamById_Data(payload: loadSingleTeamPayload) {
    const TeamStore = useTeamStore();
    const commonStore = useCommonStore();
    commonStore.setLoading(true); 
    commonStore.setError(null);

    try {
      const { result } = await call_SingleTeamById_Data(payload);
      TeamStore.setSingleTeam(result); 
    } catch (e: any) {
      commonStore.setError(e.message || '載入單一球隊資料失敗');
      throw e;
    } finally {
      commonStore.setLoading(false);
    }
  },
}
