import guu from "./techniques/guu.png"
import chi from "./techniques/chi.png"
import paa from "./techniques/paa.png"
import hidden from "./techniques/hidden.png"
import {JaJankenTechnique} from "../game/data/JaJankenTechnique";

export const TechniqueImg = {
    guu: guu,
    chi: chi,
    paa: paa,
    hidden: hidden,
    fromTechnique: (technique) => {
        if (technique === JaJankenTechnique.Chi) {
            return chi
        } else if (technique === JaJankenTechnique.Guu) {
            return guu
        } else if (technique === JaJankenTechnique.Paa) {
            return paa
        } else {
            return hidden
        }
    }
}