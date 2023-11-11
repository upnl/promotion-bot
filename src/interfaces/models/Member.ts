import { ConfigData } from "./Config.js"

export interface Regular {
    config: ConfigData
}

export interface Associate {
}

export type Member = Regular | Associate