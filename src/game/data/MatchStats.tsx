import {JaJankenTechnique} from "./JaJankenTechnique";

export interface MatchStats {
    p2: string;
    p1Hidden: string;
    p2Hidden: string;
    pPlayed: JaJankenTechnique;
    playTime: number;
    revealTime: number;
}