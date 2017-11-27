import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);
const Stats = require('stats-js');


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


var container = document.createElement('div');
document.body.appendChild(container);


function addTestSphere() {
    var geometry = new THREE.SphereGeometry(1, 50, 50);

    var wireframe = new THREE.WireframeGeometry(geometry);
    var mesh = new THREE.LineSegments(wireframe);
    mesh.material.depthTest = false;
    mesh.material.opacity = 1;
    mesh.material.transparent = true;

    scene.add(mesh);
}


function addTestSphere2() {
    var geometry = new THREE.SphereBufferGeometry(200, 50, 50);
    var material = new THREE.MeshStandardMaterial({ color: 0x00aaff, metalness: 0.1, dithering: true });
    var mesh = new THREE.Mesh(geometry, material);
    // mesh.geometry.computeVertexNormals();
    scene.add(mesh);

    // var outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
    // var outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
    // outlineMesh.scale.addScalar(0.005);
    // outlineMesh.position.copy(mesh.position);
    // console.log(mesh.position);
    // scene.add(outlineMesh);

    return mesh;
}


function addTestSphere3() {
    var geometry = new THREE.SphereGeometry(100, 50, 50);
    var material = new THREE.MeshLambertMaterial({ color: 0xffffaa, emissive: 0xffffaa, transparent: true/*, dithering: true*/ });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(500, 0, 0);

    var light = new THREE.PointLight(0xffffff, 1, 0, 0.00001);
    mesh.add(light);

    scene.add(mesh);
}


function addCurve() {
    var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, -1, 0),
    ], true, 'centripetal', 0.5);

    var points = curve.getPoints(50);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var curveObject = new THREE.Line(geometry, material);

    scene.add(curveObject);
}


function addTestCube() {
    var geometry = new THREE.CubeGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    var testMesh = new THREE.Mesh(geometry, material);
    scene.add(testMesh);
}


function addTestLight() {
    var light = new THREE.PointLight(0xffffff, 1, 0, 0.00001);
    // var light = new THREE.DirectionalLight();
    light.position.set(0, 500, 500);
    scene.add(light);

    var pointLightHelper = new THREE.PointLightHelper(light, 10);
    scene.add(pointLightHelper);
}


function addAmbientLight() {
    var light = new THREE.AmbientLight(0xffffff, 0.05);

    scene.add(light);
}


camera.position.z = 1000;

var earth = addTestSphere2();
addTestSphere3();
addAmbientLight();

var earthOutline = showOutline(earth);


function showOutline(obj) {
    var outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
    var outline = new THREE.Mesh(obj.geometry, outlineMaterial);
    outline.position.copy(obj.position);

    var distanceToCamera = obj.position.distanceTo(camera.position);
    // console.log(distanceToCamera);
    // console.log(camera.position);
    var lineThickness = 100 / distanceToCamera ;
    // console.log(obj.geometry.radius);
    // console.log(lineThickness);

    outline.scale.addScalar(lineThickness);
    scene.add(outline);
    return outline;
}

function updateOutline(obj,objOutline) {
    var distanceToCamera = obj.position.distanceTo(camera.position);
    var lineThickness = distanceToCamera / 10000;
    objOutline.scale.copy(obj.scale);
    objOutline.scale.addScalar(lineThickness);
}


var renderer = new THREE.WebGLRenderer({ antialias: true /*, precision:"highp"*/ });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);



var controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
controls.enableDamping = true;


var stats = new Stats();
// stats.setMode(1);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
container.appendChild(stats.domElement);


function onWindowResize() {
    var width = window.innerWidth, height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener('resize', onWindowResize, false);


function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}
window.addEventListener('mousemove', onMouseMove, false);


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    controls.update();

    stats.update();


    updateOutline(earth,earthOutline);

    // curveObject.rotation.x += 0.01;
    // curveObject.rotation.y += 0.01;
}
animate();