import * as THREE from 'three'

const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats-js');


export default class canvas {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.highlighted = null;
        this.renderer = undefined;
        this.controls = undefined;
        this.planets = [];

        this.init();

    }

    // INIT
    init() {
        this.initRenderer();
        this.initControls();
        this.initStats();


    }

    initRenderer() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);

        this.renderer = new THREE.WebGLRenderer({ antialias: true /*, precision:"highp"*/ });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.autoRotate = true;
        this.controls.enableDamping = true;
    }

    initStats() {
        this.stats = new Stats();
        // this.stats.setMode(1);
        this.container.appendChild(this.stats.domElement);
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        this.stats.update();

        // this.updateOutline(this.highlighted);
        this.raycast();
    }


    //DRAW
    drawPlanet(planet) {
        let geometry = new THREE.SphereBufferGeometry(planet.radius, 50, 50);
        let material = new THREE.MeshLambertMaterial(planet.materialProperties);
        planet.mesh = new THREE.Mesh(geometry, material);

        planet.mesh.position.copy(planet.position);

        let outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
        planet.outline = new THREE.Mesh(planet.mesh.geometry, outlineMaterial);

        planet.outline.position.copy(planet.position);
        planet.outline.visible = false;

        let group = new THREE.Group();
        group.add(planet.mesh);
        group.add(planet.outline);

        this.scene.add(group);
        this.planets.push(planet);

    }

    updateOutline(planet) {

        let outline = planet.parent.children[1];
        let distanceToCamera = planet.position.distanceTo(this.camera.position);
        let lineThickness = distanceToCamera / (planet.geometry.parameters.radius * 200);
        outline.scale.copy(planet.scale);
        outline.scale.addScalar(lineThickness);
        outline.visible = true;
    }


    drawAmbientLight() {
        let light = new THREE.AmbientLight(0xffffff, 1);

        this.scene.add(light);
    }

    drawPointLight(planet) {
        let light = new THREE.PointLight(0xffffff, 1, 0, 0);
        light.position.copy(planet.position);
        this.scene.add(light);
    }


    raycast() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

        if (intersects.length !== 0) {
            if (this.highlighted !== null) this.highlighted.parent.children[1].visible = false;
            this.updateOutline(intersects[0].object);
            this.highlighted = intersects[0].object;
        } else {
            if (this.highlighted !== null) this.highlighted.parent.children[1].visible = false;
            this.highlighted = null;
        }



        // intersects[0].object.visible = true;
        // this.highlighted.mesh = intersects[0].object;
        // for (let i = 1; i++; i < intersects.length) {
        //     intersects[i].object.visible = false;
        // }
        // intersects[0].object

        this.renderer.render(this.scene, this.camera);
    }
}