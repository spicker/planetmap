import * as THREE from 'three';


export default class Planet {
    constructor(
        radius = 100
        , posRadius = 0
        , posPhi = 0
        , posTheta = 0
        , materialProperties = { color: 0xffffff, dithering: true }
        , parentPlanet = null
        , orbit = null) {

        this.radius = radius;
        this.orbit = orbit;
        this.spherical = new THREE.Spherical(posRadius, posPhi, posTheta);
        this.position = new THREE.Vector3().setFromSpherical(this.spherical);
        this.parentPlanet = parentPlanet;
        this.mesh = undefined;
        this.outline = null;
        this.materialProperties = materialProperties;
        this.materialProperties.dithering = true;
        this.highlighted = false;
        this.selected = false;
    }

    update(camera) {
        const beta = 1 * Math.PI / 180;
        const d = this.mesh.position.distanceTo(camera.position);
        const r = this.radius;
        const alpha = Math.acos(r / d);
        const geg = Math.sin(alpha) * d;
        const o = Math.tan(beta) * geg;
        const gamma = Math.PI / 2 - alpha;
        const s = ((o + r) / Math.cos(gamma)) - r;
        const lineOffset = s / r;

        if (this.highlighted || this.selected) {
            this.outline.scale.copy(this.mesh.scale);
            this.outline.scale.addScalar(lineOffset);

            this.outline.lookAt(camera.position);
        }
        this.outline.visible = this.highlighted || this.selected;
        // this.selected ? this.outline.material.color = new THREE.Color(0x44ff44) : this.outline.material.color = new THREE.Color(0xffffff);
    }

    draw() {
        let geometry = new THREE.SphereBufferGeometry(this.radius, 100, 100);
        let material = new THREE.MeshLambertMaterial(this.materialProperties);
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.copy(this.position);

        this.outline = this.drawOutlineCircle();

        this.outline.position.copy(this.position);
        this.outline.visible = false;

        let group = new THREE.Group();
        group.add(this.mesh);
        group.add(this.outline);

        return group;
    }

    drawOutlineCircle() {
        let curve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            this.radius, this.radius,           // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );

        let points = curve.getPoints(100);
        let geometry = new THREE.BufferGeometry().setFromPoints(points);

        let material = new THREE.LineBasicMaterial({ color: 0xffffff });

        let circle = new THREE.Line(geometry, material);

        return circle;
    }

    drawOutline() {
        let outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
        this.outline = new THREE.Mesh(this.mesh.geometry, outlineMaterial);
    }

    drawCircle(){

    }
}


