export default class Orbit {
    constructor(center, semiMajor, inclination, eccentricity, longAsc, argPer, mAnomaly) {
        this.center = center;
        this.semiMajor = semiMajor;
        this.inclination = inclination;
        this.eccentricity = eccentricity;
        this.longAsc = longAsc;
        this.argPer = argPer;
        this.mAnomaly = mAnomaly;
    }
}