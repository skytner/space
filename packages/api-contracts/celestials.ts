import { Enitity } from "./entity"
import { ObjectPosition } from "./object"

export enum CelectialType {
    Star = "star",
    Planet = "planet",
    Galaxy = "galaxy",
    Comet = "comet",
    Asteroid = "asteroid",
    Pulsar = "pulsar",
    BlackHole = "blackHole"
}

export interface Celectial extends Enitity {
    name: string
    description: string;
    position: ObjectPosition
    type: CelectialType
}