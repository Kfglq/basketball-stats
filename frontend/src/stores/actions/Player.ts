// src/stores/actions/Player.ts
import { call_PlayerById_Data } from '@/stores/service/Player';
import { usePlayerStore, useCommonStore } from '@/stores';
import { loadPlayerPayload } from '@/types/stores/Player';

const PlayerStore = usePlayerStore();
const commonStore = useCommonStore();

export const Player_actions = {
  async load_PlayerById_Data(payload: loadPlayerPayload) {
    commonStore.setLoading(true); 
    commonStore.setError(null);

    try {
      const { result } = await call_PlayerById_Data(payload);
      PlayerStore.setPlayerData(result); 
    } catch (e: any) {
      commonStore.setError(e.message || '載入球員資料失敗');
      throw e;
    } finally {
      commonStore.setLoading(false);
    }
  },
}
