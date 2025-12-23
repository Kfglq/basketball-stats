// src/stores/service/Players.ts
import request from '@/utils/request'; // 假設您使用 Axios
import { loadPlayerPayload } from '@/types/stores/Player';

export const call_PlayerById_Data = async (payload: loadPlayerPayload) => (
  await request.get('/player/playerById', payload)
);
