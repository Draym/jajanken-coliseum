import {JaJankenTechnique} from "./JaJankenTechnique";

export interface MatchStats {
    p2: string;
    p1Hidden: string;
    p2Hidden: string;
    p1Revealed: JaJankenTechnique;
    p2Revealed: JaJankenTechnique;
    playTime: number;
    revealTime: number;
}