import * as THREE from 'three';

export default class Orbit {
    constructor(
        center, semiMajor0, semiMajor, eccentricity0, eccentricity, inclination0, inclination, mLong0, mLong, longPe0, longPe, longAsc0, longAsc) {
        this.center = center,
            this.semiMajor = semiMajor, this.semiMajor0 = semiMajor0,
            this.inclination = inclination, this.inclination0 = inclination0,
            this.eccentricity = eccentricity, this.eccentricity0 = eccentricity0,
            this.longPe = longPe, this.longPe0 = longPe0,
            this.mLong = mLong, this.mLong0 = mLong0,
            this.longAsc = longAsc, this.longAsc0 = longAsc0;
    }

    draw() {
        const material = new THREE.LineBasicMaterial();
        let points = [],
            d = 2458088;
        for (var i = d; i <= d + 364; i+=1) {
            points.push(this.calculate(i).multiplyScalar(149597870.7));
        }
        console.log(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbit = new THREE.Line(geometry, material);

        // orbit.position.set(0, 0, 0);

        return orbit;
    }

    orbitTime(t) {
        return (t - 2451545) / 36525;
    }

    calculate(t) {
        const tol = 0.000001;

        const T = (t - 2451545) / 365.25,
            e = this.eccentricity0 + this.eccentricity * T,
            a = this.semiMajor0 + this.semiMajor * T,
            I = this.inclination0 + this.inclination * T,
            L = this.mLong0 + this.mLong * T,
            w = this.longPe0 + this.longPe * T,
            O = this.longAsc0 + this.longAsc * T,
            argPe = w - O,
            estar = 180 / Math.PI * e;
        let M = L - w;

        const Ezero = M + estar * Math.sin(M);

        let E = Ezero,
            n = 0,
            deltaM = 0,
            deltaE = 0;
        do {
            deltaM = M - (E - estar * Math.sin(E));
            deltaE = deltaM / (1 - e * Math.cos(E));
            E += deltaE;
            n++;
            // console.log(deltaE)
        } while (Math.abs(deltaE) > tol);

        M = E - estar * Math.sin(E);
        const xs = a * (Math.cos(E) - e),
            ys = a * Math.sqrt(1 - e * e) * Math.sin(E),
            zs = 0;
        const re = (new THREE.Vector3(
                    Math.cos(argPe) * Math.cos(O) - Math.sin(argPe) * Math.sin(O) * Math.cos(I),
                    Math.sin(argPe) * Math.sin(I),
                    Math.cos(argPe) * Math.sin(O) + Math.sin(argPe) * Math.cos(O) * Math.cos(I)
                )
                .multiplyScalar(xs))
            .add(new THREE.Vector3(
                    (-1 * Math.sin(argPe) * Math.cos(O) - Math.cos(argPe) * Math.sin(O) * Math.cos(I)),
                    Math.cos(argPe) * Math.sin(I),
                    (-1 * Math.sin(argPe) * Math.sin(O) + Math.cos(argPe) * Math.cos(O) * Math.cos(I))
                )
                .multiplyScalar(ys));

        return re;
    }
}