// src/stores/actions/Team.ts
import { call_AllTeams_List, call_SingleTeamById_Data } from '@/stores/service/Team';
import { useTeamStore, useCommonStore } from '@/stores';
import { loadSingleTeamPayload } from '@/types/stores/Team';

const TeamStore = useTeamStore();
const commonStore = useCommonStore();

export const Team_actions = {
  async load_AllTeams_List() {
    commonStore.setLoading(true); 
    commonStore.setError(null);

    try {
      const { result } = await call_AllTeams_List();
      TeamStore.setAllTeams(result); 
    } catch (e: any) {
      commonStore.setError(e.message || '載入列表 1 失敗');
      throw e;
    } finally {
      commonStore.setLoading(false);
    }
  },

  async load_SingleTeamById_Data(payload: loadSingleTeamPayload) {
    commonStore.setLoading(true); 
    commonStore.setError(null);

    try {
      const { result } = await call_SingleTeamById_Data(payload);
      TeamStore.setSingleTeam(result); 
    } catch (e: any) {
      commonStore.setError(e.message || '載入列表 1 失敗');
      throw e;
    } finally {
      commonStore.setLoading(false);
    }
  },
}
