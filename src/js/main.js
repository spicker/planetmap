import Canvas from './canvas';
import Planet from './planet';
import Orbit from './orbit';
import * as Util from './util';


let rr = () => (Math.random() * 360);

let canvas = new Canvas();
let earth = new Planet(6300, 150000000, 0, rr(), {
    color: 0x0077ff
});
let sun = new Planet(695700, 0, 0, 0, {
    color: 0xffffaa,
    emissive: 0xffffaa
});
let moon = new Planet(1737, 385000, 0, rr(), {
    color: 0x888888
}, earth);
let venus = new Planet(6051, 108280000, 0, rr(), {
    color: 0xbbbb88
});
let mars = new Planet(3389, 227939200, 0, rr(), {
    color: 0xff4411
});
let saturn = new Planet(58232, 1433530000, 0, rr(), {
    color: 0xbb8822
});
let jupiter = new Planet(69911, 778570000, 0, rr(), {
    color: 0xccaa88
});


canvas.camera.position.copy(earth.position);
canvas.camera.position.z -= (earth.radius * 3);
canvas.controls.target.copy(earth.position);
// console.log(canvas.camera.position)
earth.orbit = new Orbit(0, 1.00000261, .00000562, .01671123, .00004392, .00001531, .01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0);
canvas.scene.add(earth.orbit.draw());


canvas.drawPlanets([earth, sun, moon, venus, mars, saturn, jupiter]);
canvas.drawPointLight(sun);
// canvas.drawAmbientLight();
// canvas.drawEcliptic();
// canvas.drawCameraHelper();
// sun.disk.renderOrder = 100;
// earth.disk.renderOrder = 2;
// moon.disk.renderOrder = 1;

sun.diskDistance = 60;
moon.diskDistance = 120;
jupiter.diskDistance = 80;
saturn.diskDistance = 80;

// let testPlanets = Array.apply(null, new Array(200))
//     .map(() => new Planet(Math.random() * 20000 + 1000, Math.random() * 10000000000 + 10000000, 0, rr()));
// testPlanets.map(p => canvas.drawPlanet(p));


(function loop() {
    window.requestAnimationFrame(loop);
    canvas.animate();
    // console.log(canvas.camera.position)
})();


Util.addEventListeners(canvas);