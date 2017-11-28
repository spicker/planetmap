import * as THREE from 'three'
// import Planet from './planet'

const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats-js');


export default class canvas {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer = undefined;
        this.controls = undefined;
        this.planets = [];
        this.highlighted = null;

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

        for (var p of this.planets) {
            p.update(this.camera.position);
        }

        this.raycast();
    }


    //DRAW
    drawPlanet(planet) {
        let group = planet.draw();

        this.scene.add(group);
        this.planets.push(planet);
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

        // highlight object under mouse. TODO: select
        if (intersects.length !== 0) {
            let selectedPlanet = this.planets.find(p => p.mesh.uuid === intersects[0].object.uuid);
            selectedPlanet.highlighted = true;
            if (this.highlighted !== null && this.highlighted !== selectedPlanet) this.highlighted.highlighted = false;
            this.highlighted = selectedPlanet;
        } else {
            if (this.highlighted !== null) this.highlighted.highlighted = false;
            this.highlighted = null;
        }

        this.renderer.render(this.scene, this.camera);
    }
}