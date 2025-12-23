// src/types/stores/Player.ts

export interface PlayerState {
  playerData: playerDetail | null;
}

export interface playerBasic {
  playerId: string;
  name: string;
  team: string;
  position: string;
  overall: string;
  version: string;
}

export interface playerDetail extends playerBasic {
	closeShot: string;
	midRangeShot: string;
	threePointShot: string;
	freeThrow: string;
	shotIQ: string;
	offensiveConsistency: string;
	layup: string;
	standingDunk: string;
	drivingDunk: string;
	postHook: string;
	postFade: string;
	postControl: string;
	drawFoul: string;
	hands: string;
	interiorDefense: string;
	perimeterDefense: string;
	steal: string;
	block: string;
	helpDefenseIQ: string;
	passPerception: string;
	defensiveConsistency: string;
	speed: string;
	agility: string;
	strength: string;
	vertical: string;
	stamina: string;
	hustle: string;
	overallDurability: string;
	passAccuracy: string;
	ballHandle: string;
	speedWithBall: string;
	passIQ: string;
	passVision: string;
	offensiveRebound: string;
	defensiveRebound: string;
	intangibles: string;
	potential: string;
}

export interface loadPlayerPayload {
  player_id: string;
}
