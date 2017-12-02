import * as THREE from 'three';
import {AU} from './util';

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

    draw(t) {
        const p = this.period(t);
        const material = new THREE.LineBasicMaterial({
            color:0xbbbbbb
        });
        let points = [];
        for (var i = t; i <= t + p; i += p / 360) {
            points.push(this.calculate(i).multiplyScalar(AU));
        }
        points.push(this.calculate(t).multiplyScalar(AU));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbit = new THREE.Line(geometry, material);

        orbit.position.copy(this.center);

        return orbit;
    }

    orbitTime(t) {
        return (t - 2451545) / 36525;
    }

    period(t) {
        const a = this.semiMajor0 + this.semiMajor * this.orbitTime(t);
        return Math.sqrt(Math.pow(a, 3)) * 365.25;
    }

    calculate(t) {
        const tol = 0.000001;

        const T = this.orbitTime(t),
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

        const Ezero = M + estar * Math.sin(THREE.Math.DEG2RAD * M);

        let E = Ezero,
            n = 0,
            deltaM = 0,
            deltaE = 0;
        do {
            deltaM = M - (E - estar * Math.sin(THREE.Math.DEG2RAD * E));
            deltaE = deltaM / (1 - e * Math.cos(THREE.Math.DEG2RAD * E));
            E += deltaE;
            n++;
            // console.log(deltaE)
        } while (Math.abs(deltaE) > tol);

        M = E - estar * Math.sin(THREE.Math.DEG2RAD * E);
        const xs = a * (Math.cos(THREE.Math.DEG2RAD * E) - e),
            ys = a * Math.sqrt(1 - e * e) * Math.sin(THREE.Math.DEG2RAD * E),
            zs = 0;
        const argPes = THREE.Math.DEG2RAD * argPe,
            Os = THREE.Math.DEG2RAD * O,
            Is = THREE.Math.DEG2RAD * I;
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