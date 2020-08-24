export class Molecule {
    constructor (mass, positionX, positionY, velocityX, velocityY, radius, color) {
        this.mass = mass;
        this.position = [positionX, positionY];
        this.velocity = [velocityX, velocityY];
        this.radius = radius;
        this.color = color;
    }
}
