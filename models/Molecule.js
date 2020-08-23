export class Molecule {
    constructor (mass, positionX, positionY, velocityX, velocityY, radius) {
        this.mass = mass;
        this.position = [positionX, positionY];
        this.velocity = [velocityX, velocityY];
        this.radius = radius;
    }
}
