import { Entity } from "./entity"
import { ObjectPosition } from "./object"

export enum CelestialType {
    Star = "star",
    Planet = "planet",
    Galaxy = "galaxy",
    Comet = "comet",
    Asteroid = "asteroid",
    Pulsar = "pulsar",
    BlackHole = "blackHole"
}

export interface Celestial extends Entity {
    name: string
    description: string;
    position: ObjectPosition
    type: CelestialType
}