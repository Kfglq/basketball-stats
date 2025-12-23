// src/types/stores/Team.ts
import { playerBasic } from './Player';

export interface TeamState {
  allTeams: Array<teams>;
  singleTeam: singleTeam;
}

export interface teams {
  conferenceName: string;
  divisionName: string;
  teamId: string;
  teamEnName: string;
  teamTwName: string;
  teamColor: string;
}

export interface loadSingleTeamPayload {
  id: string;
}

export interface singleTeam {
  roster: Array<playerBasic>;
}

// export interface loadSingleTeamParams {
//   id: string,
// }

// export interface loadTeamData2Params {
//   req1: string,
//   req2: number,
// }
