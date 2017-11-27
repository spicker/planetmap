import { Vector3 } from 'three';


export default class Planet {
    constructor(
        radius = 100
        , position = [0, 0, 0]
        , materialProperties = { color: 0xffffff, dithering: true }
        , parentPlanet = null
        , orbit = null) {

        this.radius = radius;
        this.orbit = orbit;
        this.position = new Vector3().fromArray(position);
        this.parentPlanet = parentPlanet;
        this.mesh = undefined;
        this.outline = null;
        this.materialProperties = materialProperties;
    }
}


