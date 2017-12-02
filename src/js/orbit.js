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
        for (var i = d; i <= d + 365; i += 1) {
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

        const T = (t - 2451545) / 36525,
            e = this.eccentricity0 + this.eccentricity * T,
            a = this.semiMajor0 + this.semiMajor * T,
            I = this.inclination0 + this.inclination * T,
            L = this.mLong0 + this.mLong * T,
            w = this.longPe0 + this.longPe * T,
            O = this.longAsc0 + this.longAsc * T,
            argPe = w - O,
            estar = THREE.Math.radToDeg(e);
        let M = L - w;
        M = M % 360 - 180;

        const Ezero = M + estar * Math.sin(THREE.Math.degToRad(M));

        let E = Ezero,
            n = 0,
            deltaM = 0,
            deltaE = 0;
        do {
            deltaM = M - (E - estar * Math.sin(THREE.Math.degToRad(E)));
            deltaE = deltaM / (1 - e * Math.cos(THREE.Math.degToRad(E)));
            E += deltaE;
            n++;
            // console.log(deltaE)
        } while (Math.abs(deltaE) > tol);

        M = E - estar * Math.sin(THREE.Math.degToRad(E));
        const xs = a * (Math.cos(THREE.Math.degToRad(E)) - e),
            ys = a * Math.sqrt(1 - e * e) * Math.sin(THREE.Math.degToRad(E)),
            zs = 0;
        const argPes = THREE.Math.degToRad(argPe),
            Os = THREE.Math.degToRad(O),
            Is = THREE.Math.degToRad(I);
        const cap = Math.cos(argPes),
            cO = Math.cos(Os),
            cI = Math.cos(Is),
            sap = Math.sin(argPes),
            sO = Math.sin(Os),
            sI = Math.sin(Is);
        const re = (new THREE.Vector3(
                    cap * cO - sap * sO * cI,
                    sap * sI,
                    cap * sO + sap * cO * cI
                )
                .multiplyScalar(xs))
            .add(new THREE.Vector3(
                    (-1 * sap * cO - cap * sO * cI),
                    cap * sI,
                    (-1 * sap * sO + cap * cO * cI)
                )
                .multiplyScalar(ys));

        return re;
    }
}