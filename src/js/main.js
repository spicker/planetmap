import Canvas from './canvas'
import Planet from './planet'


let canvas = new Canvas();
let earth = new Planet(6300, 150000000, 90, 0, { color: 0x0077ff });
let sun = new Planet(695700, 0, 0, 0, { emissive: 0xffffaa });
let moon = new Planet(1737, 150385000, 80, 0);
let venus = new Planet(6051, 108280000, 90.0, { color: 0xffffee });
let mars = new Planet(3389, 227939200, 90, 0, { color: 0xff8822 });
let saturn = new Planet(58232, 1433530000, 90, 0);
let jupiter = new Planet(69911, 778570000, 90, 0);

canvas.camera.position.copy(earth.position);
canvas.camera.position.z -= (earth.radius * 2);
canvas.controls.target.copy(earth.position);


canvas.drawPlanets([earth, sun, moon, venus, mars, saturn, jupiter]);
canvas.drawPointLight(sun);
canvas.drawAmbientLight();
// canvas.drawCameraHelper();


// let testPlanets = Array.apply(null, new Array(20))
//     .map(() => new Planet(Math.random() * 1000 + 10, Math.random() * 100000 + 1000, Math.random() * 180, Math.random() * 360))
// testPlanets.map(p => canvas.drawPlanet(p));


(function loop() {
    window.requestAnimationFrame(loop);
    canvas.animate();
    // console.log(canvas.camera.position)
})();


function onWindowResize() {
    let width = window.innerWidth, height = window.innerHeight;
    canvas.camera.aspect = width / height;
    canvas.camera.updateProjectionMatrix();
    canvas.renderer.setSize(width, height);
}

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    canvas.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    canvas.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    canvas.updateHighlight(canvas.raycast(), false);
}

function onDocumentMouseDown(event) {
    canvas.updateHighlight(canvas.raycast(), true);
}

window.addEventListener('mousedown', onDocumentMouseDown, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);