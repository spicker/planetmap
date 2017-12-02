import Canvas from './canvas';
import Planet from './planet';
import Orbit from './orbit';
import * as Util from './util';
import orbits from './orbits.json'
import * as THREE from 'three';


let time = 2458088;
let canvas = new Canvas();
let sun = new Planet(695700, 0, 0, 0, {
    color: 0xffffaa,
    emissive: 0xffffaa
});
// let earth = new Planet(6300, 0, 0, 0, {
//     color: 0x0077ff
// }, sun, new Orbit(sun.position, 1.00000261, .00000562, .01671123, .00004392, .00001531, .01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0.0, 0.0), time);

// // let moon = new Planet(1737, 385000, 0, 0, {
// //     color: 0x888888
// // }, earth);
// let venus = new Planet(6051, 108280000, 0, 0, {
//     color: 0xbbbb88
// }, sun, getOrbit("venus"), time);
// let mars = new Planet(3389, 227939200, 0, 0, {
//     color: 0xff4411
// });
// let saturn = new Planet(58232, 1433530000, 0, 0, {
//     color: 0xbb8822
// });
// let jupiter = new Planet(69911, 778570000, 0, 0, {
//     color: 0xccaa88
// });

function getOrbit(planetName) {
    const e = orbits.orbits.find(p => p.name === planetName);
    return new Orbit(sun.position, e.a, e.da, e.e, e.de, e.I, e.dI, e.L, e.dL, e.longperi, e.dlongperi, e.longnode, e.dlongnode);
}

let planets = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"]
    .map(p => {
        const e = orbits.orbits.find(o => o.name === p);
        return new Planet(e.radius, 0, 0, 0, {
            color: new THREE.Color(e.color)
        }, sun, getOrbit(p), time);
    });
planets.push(sun);

canvas.camera.position.copy(sun.position);
canvas.camera.position.z -= (sun.radius * 3);
canvas.controls.target.copy(sun.position);



canvas.drawPlanets(planets);
canvas.drawPointLight(sun);
// canvas.drawAmbientLight();
// canvas.drawEcliptic();
// canvas.drawCameraHelper();
// sun.disk.renderOrder = 100;
// earth.disk.renderOrder = 2;
// moon.disk.renderOrder = 1;

sun.diskDistance = 60;
// jupiter.diskDistance = 80;
// saturn.diskDistance = 80;

// let testPlanets = Array.apply(null, new Array(200))
//     .map(() => new Planet(Math.random() * 20000 + 1000, Math.random() * 10000000000 + 10000000, 0, 0));
// testPlanets.map(p => canvas.drawPlanet(p));


(function loop() {
    window.requestAnimationFrame(loop);
    canvas.animate();
    // console.log(canvas.camera.position)
})();


Util.addEventListeners(canvas);