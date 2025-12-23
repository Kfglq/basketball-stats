// src/stores/state/Player.ts
import { PlayerState } from '@/types/stores/Player';
import { createStore } from '@/stores/createStore';

const PlayerStateDefaults: PlayerState = {
  playerData: null,
};

export const usePlayerStore = createStore('Player', PlayerStateDefaults);
