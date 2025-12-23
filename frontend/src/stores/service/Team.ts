// src/stores/service/Teams.ts
import request from '@/utils/request'; // 假設您使用 Axios
import { loadSingleTeamPayload } from '@/types/stores/Team';

export const call_AllTeams_List = async () => (
  await request.get('/team/allteams')
);

export const call_SingleTeamById_Data = async (payload: loadSingleTeamPayload) => (
  await request.get('/team/singleTeamById', payload)
);
