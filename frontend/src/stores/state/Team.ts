// src/stores/state/Team.ts
import { TeamState } from '@/types/stores/Team';
import { createStore } from '@/stores/createStore';

const TeamStateDefaults: TeamState = {
  allTeams: [],
  singleTeam: { roster: [] },
};

export const useTeamStore = createStore('Team', TeamStateDefaults);
