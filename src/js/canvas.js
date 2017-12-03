import * as THREE from 'three'
// import Planet from './planet'
import Stats from 'stats-js';
import _oc from 'three-orbit-controls';
const OrbitControls = _oc(THREE);


export default class canvas {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000000000000);
        // this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 100000000000 );
        this.scene = new THREE.Scene();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer = undefined;
        this.controls = undefined;
        this.planets = [];
        this.planetMeshes = [];
        this.highlighted = null;
        this.selected = null;

        this.init();
    }

    // INIT
    init() {
        this.initRenderer();
        this.initControls();
        this.initStats(0);
    }

    initRenderer() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);

        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            // precision:"highp",
            logarithmicDepthBuffer: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.sortObjects = false;
        this.container.appendChild(this.renderer.domElement);
    }

    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.autoRotate = true;
        // this.controls.enableDamping = true;
    }

    initStats(mode) {
        this.stats = new Stats();
        this.stats.setMode(mode);
        this.container.appendChild(this.stats.domElement);
    }

    animate() {
        this.stats.update();

        for (var p of this.planets) {
            p.update(this.camera);
        }
        this.renderer.render(this.scene, this.camera);

    }


    //DRAW
    drawPlanet(planet) {
        let group = planet.draw();

        this.scene.add(group);
        this.planets.push(planet);
        this.planetMeshes.push(planet.sphere, planet.disk);
    }

    drawPlanets(planets) {
        for (let p of planets) {
            this.drawPlanet(p);
        }
    }


    drawAmbientLight() {
        let light = new THREE.AmbientLight(0xffffff, 0.5);

        this.scene.add(light);
    }

    drawPointLight(planet) {
        let light = new THREE.PointLight(0xffffff, 1, 0, 0);
        light.position.copy(planet.position);
        this.scene.add(light);
    }

    drawCameraHelper() {
        let helper = new THREE.CameraHelper(this.camera);
        this.scene.add(helper);
    }

    drawEcliptic() {
        var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
        var helper = new THREE.PlaneHelper(plane, 1000000000000, 0x222222);
        helper.renderOrder = 0;
        this.scene.add(helper);
    }


    raycast() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects = this.raycaster.intersectObjects(this.planetMeshes);

        return intersects;
    }

    updateHighlight(intersects, select) {
        if (intersects.length !== 0) {
            let planet = this.planets.find(p =>
                p.sphere.uuid === intersects[0].object.uuid || p.disk.uuid === intersects[0].object.uuid);
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
        const pos = planet.position;
        const cam = this.camera;
        const oldTarget = this.controls.target;
        const transl = new THREE.Vector3().copy(pos).sub(oldTarget);

        cam.position.add(transl);
        if (cam.position.distanceTo(pos) <= planet.radius) cam.position.z -= planet.radius * 3;
        this.controls.target.copy(pos);
    }

}