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
        this.parentPlanet = parentPlanet;
        this.orbit = orbit;
        this.sphere = undefined;
        this.outline = null;
        this.disk = null;
        this.materialProperties = materialProperties;
        this.materialProperties.dithering = true;
        this.highlighted = false;
        this.selected = false;
        this.diskDistance = 100;

        this.initSpherical(posRadius, posPhi, posTheta);
    }

    initSpherical(posRadius, posPhi, posTheta) {
        if (this.parentPlanet !== null) {
            this.relativeSpherical = new THREE.Spherical(posRadius, posPhi, posTheta);
            this.spherical = new THREE.Spherical()
                .setFromVector3(new THREE.Vector3()
                    .setFromSpherical(this.parentPlanet.spherical)
                    .add(new THREE.Vector3()
                        .setFromSpherical(this.relativeSpherical)));
        } else {
            this.spherical = new THREE.Spherical(posRadius, posPhi, posTheta);
            this.relativeSpherical = this.spherical;
        }
        this.position = new THREE.Vector3().setFromSpherical(this.spherical);
    }

    update(camera) {
        this.updateSphere(camera);
        this.updateDisk(camera);
        this.updateOutline(camera);
    }

    updateOutline(camera) {
        if (this.highlighted || this.selected) {
            const offset = 0.5;
            const beta = offset * Math.PI / 180;
            const d = this.sphere.position.distanceTo(camera.position);
            const r = this.radius;
            let lineOffset = 0;

            if (d / r < this.diskDistance) {
                const alpha = Math.acos(r / d);
                const geg = Math.sin(alpha) * d;
                const o = Math.tan(beta) * geg;
                const gamma = Math.PI / 2 - alpha;
                const s = ((o + r) / Math.cos(gamma)) - r;
                lineOffset = s / r + 1;

            } else {
                const ddisk = this.diskDistance * r;
                const alpha = Math.atan(r / ddisk);
                const gamma = beta + alpha;
                const s = (Math.tan(gamma) * ddisk) - r;
                lineOffset = (s / r + 1) * this.disk.scale.x;
            }
            this.outline.scale.setScalar(lineOffset);
            this.outline.lookAt(camera.position);

        }
        this.outline.visible = this.highlighted || this.selected;
        // this.selected ? this.outline.material.color = new THREE.Color(0x44ff44) : this.outline.material.color = new THREE.Color(0xffffff);

    }
    updateDisk(camera) {
        const distance = this.sphere.position.distanceTo(camera.position);
        const dr = distance / this.radius;

        this.disk.visible = dr >= this.diskDistance;
        if (this.disk.visible) {
            this.disk.scale.setScalar(dr / this.diskDistance);
        }

        this.disk.lookAt(camera.position);
    }

    updateSphere(camera) {
        const distance = this.sphere.position.distanceTo(camera.position);

        this.sphere.visible = (distance / this.radius) < this.diskDistance;
    }

    draw() {
        this.sphere = this.drawSphere();
        this.sphere.position.copy(this.position);

        this.outline = this.drawOutlineCircle();
        this.outline.position.copy(this.position);

        this.disk = this.drawDisk();
        this.disk.position.copy(this.position);

        let group = new THREE.Group();
        group.add(this.sphere);
        group.add(this.outline);
        group.add(this.disk);

        return group;
    }

    drawSphere() {
        let geometry = new THREE.SphereBufferGeometry(this.radius, 100, 100);
        let material = new THREE.MeshLambertMaterial(this.materialProperties);
        let sphere = new THREE.Mesh(geometry, material);

        return sphere;
    }

    drawDisk() {
        let geometry = new THREE.CircleBufferGeometry(this.radius, 50);
        let material = new THREE.MeshBasicMaterial({ color: this.materialProperties.color });
        let disk = new THREE.Mesh(geometry, material);

        return disk;
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
        this.outline = new THREE.Mesh(this.sphere.geometry, outlineMaterial);
    }


}


