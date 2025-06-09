import { GameScoreboard } from "../game/GameScoreboard";

export interface GameTournamentListener{

	playerMakePoint(gameScoreboard : GameScoreboard) : void;
	playerEnd(gameScoreboard : GameScoreboard) : void;

}