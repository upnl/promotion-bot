import { ConfigData } from "../config.js"

export interface Regular {
    config: ConfigData
}

export interface Associate {
}

export type Member = Regular | Associate