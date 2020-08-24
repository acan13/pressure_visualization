export class Molecule {
    constructor (mass, positionX, positionY, velocityX, velocityY, radius, color) {
        // molar mass
        this.mass = mass; // kg / mol
        this.position = [positionX, positionY]; // m
        this.velocity = [velocityX, velocityY]; // m / s
        this.radius = radius;
        this.color = color;
    }
}
