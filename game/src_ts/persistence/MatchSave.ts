import { Game } from "../game/Game";

export interface MatchSave {
	save(match: Game): void;
}