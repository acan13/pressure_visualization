export class Container {
    constructor (height, width) {
        this.height = height; // km
        this.width = width; // km
        this.totalTransferredEnergy = 0; // kg * m / s
        this.secondsElapsed = 0; // s
    }

    get containerSurfaceArea () { // m ^ 2
        return (2 * this.height + 2 * this.width) * 1000000;
    }

    get averagePressure () {
        if (this.secondsElapsed === 0) {
            return 0;
        }

        return this.totalTransferredEnergy / this.secondsElapsed / this.containerSurfaceArea;
    }
}
