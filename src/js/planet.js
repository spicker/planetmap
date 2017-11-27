import {Vector3} from 'three';


export default class Planet {
    constructor(radius = 100, position = new Vector3(0, 0, 0), parentPlanet = null, orbit = null) {
        this.radius = radius;
        this.orbit = orbit;
        this.position = position;
        this.parentPlanet = parentPlanet;
        this.mesh = undefined;
        this.outline = null;
    }


    // draw(scene) {
    //     let geometry = new THREE.SphereBufferGeometry(this.radius, 50, 50);
    //     let material = new THREE.MeshLambertMaterial({ dithering: true });
    //     this.mesh = new THREE.Mesh(geometry, material);

    //     this.mesh.position.copy(this.position);

    //     scene.add(this.mesh)
    // }

}


