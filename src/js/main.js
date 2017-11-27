import Canvas from './canvas'
import Planet from './planet'


let canvas = new Canvas();
let earth = new Planet(100, [0, 0, 0], { color: 0x0077ff });
let sun = new Planet(1000, [10000, 0, 0], { emissive: 0xffffaa, dithering: true });

canvas.camera.position.z = 500;


canvas.drawPlanet(earth);
canvas.drawPlanet(sun);
canvas.drawPointLight(sun);

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
}
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);