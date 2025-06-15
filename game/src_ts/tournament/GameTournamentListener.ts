import { GameScoreboard } from "../game/GameScoreboard";

export interface GameTournamentListener{

	playerMakePoint(gameScoreboard : GameScoreboard) : void;
	playEnded(gameScoreboard : GameScoreboard) : void;

}