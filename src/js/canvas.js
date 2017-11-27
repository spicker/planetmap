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
        // this.raycast();
    }


    //DRAW
    drawPlanet(planet) {
        let geometry = new THREE.SphereBufferGeometry(planet.radius, 50, 50);
        let material = new THREE.MeshLambertMaterial({ dithering: true });
        let mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(planet.position);

        this.scene.add(mesh);
        this.planets.push(planet);
    }

    drawOutline(planet) {
        this.highlighted = planet;

        let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
        planet.outline = new THREE.Mesh(planet.mesh.geometry, material);

        planet.outline.position.copy(planet.position);

        this.scene.add(planet.outline);
    }

    updateOutline(planet) {
        if (planet != null) {
            if (planet.outline === null) {
                drawOutline(planet);
            } else {
                let distanceToCamera = planet.position.distanceTo(camera.position);
                let lineThickness = distanceToCamera / (planet.geometry.parameters.radius * 500);
                outline.scale.copy(planet.scale);
                outline.scale.addScalar(lineThickness);
            }
        }
    }


    drawAmbientLight() {
        let light = new THREE.AmbientLight(0xffffff, 1);

        this.scene.add(light);
    }


    // raycast() {
    //     this.raycaster.setFromCamera(this.mouse, this.camera);

    //     // calculate objects intersecting the picking ray
    //     let intersects = this.raycaster.intersectObjects(this.planets.forEach(p => p.mesh));

    //     intersects[0].object.visible = true;
    //     this.highlighted.mesh = intersects[0].object;
    //     for (let i = 1; i++; i < intersects.length) {
    //         intersects[i].object.visible = false;
    //     }
    //     // intersects[0].object

    //     this.renderer.render(scene, camera);
    // }
}