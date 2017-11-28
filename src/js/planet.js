import * as THREE from 'three';


export default class Planet {
    constructor(
        radius = 100
        , position = [0, 0, 0]
        , materialProperties = { color: 0xffffff, dithering: true }
        , parentPlanet = null
        , orbit = null) {

        this.radius = radius;
        this.orbit = orbit;
        this.position = new THREE.Vector3().fromArray(position);
        this.parentPlanet = parentPlanet;
        this.mesh = undefined;
        this.outline = null;
        this.materialProperties = materialProperties;
        this.highlighted = false;
    }

    update(cameraPos) {

        let distanceToCamera = this.position.distanceTo(cameraPos);
        let lineThickness = distanceToCamera / (this.mesh.geometry.parameters.radius * 200);
        this.outline.scale.copy(this.mesh.scale);
        this.outline.scale.addScalar(lineThickness);

        this.outline.visible = this.highlighted;
    }

    draw() {
        let geometry = new THREE.SphereBufferGeometry(this.radius, 50, 50);
        let material = new THREE.MeshLambertMaterial(this.materialProperties);
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.copy(this.position);

        let outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
        this.outline = new THREE.Mesh(this.mesh.geometry, outlineMaterial);

        this.outline.position.copy(this.position);
        this.outline.visible = false;

        let group = new THREE.Group();
        group.add(this.mesh);
        group.add(this.outline);

        return group;
    }
}


