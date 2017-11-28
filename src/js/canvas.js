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
        this.selected = null;

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

        let intersects = this.raycaster.intersectObjects(this.planets.map(p => p.mesh));

        return intersects;
    }

    updateHighlight(intersects, select) {
        if (intersects.length !== 0) {
            let planet = this.planets.find(p => p.mesh.uuid === intersects[0].object.uuid);
            planet.highlighted = true;
            if (select) {
                if (this.selected !== null && planet !== this.selected) this.selected.selected = false;
                planet.selected = true;
                this.selected = planet;
                this.focusCamera(planet);
            }
            if (this.highlighted !== null && this.highlighted !== planet) this.highlighted.highlighted = false;
            this.highlighted = planet;
        } else {
            if (this.highlighted !== null) this.highlighted.highlighted = false;
            this.highlighted = null;
        }
    }

    focusCamera(planet) {
        let distance = this.camera.position.distanceTo(planet.position);
        // distance = this.camera.position.distanceTo(this.selected);
        // this.camera.position.copy(this.selected.position);
        // this.camera.position.z = this.camera.position.z + 500;
        console.log(distance);
        console.log(this.camera);
    }

}