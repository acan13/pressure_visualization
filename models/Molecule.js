import { MolecularVelocityHelper } from '../helpers/molecularVelocityHelper';

export class Molecule {
    constructor ({
        mass, // g
        positionX, // km
        positionY, // km
        radius, // px
        color,
        temp = 298, // K
        velocityX, // km / s
        velocityY, // km / s
    }) {
        // molar mass
        this.mass = mass; // kg / mol
        this.position = [positionX, positionY]; // km
        this.radius = radius;
        this.color = color;
        if (velocityX !== undefined && velocityY !== undefined) {
            this.velocity = [velocityX, velocityY];
        } else {
            this.velocity = this._getVelocity(temp, mass); // km / s
        }
    }

    _getVelocity (temp, mass) {
        const speed = MolecularVelocityHelper.getRMSVelocity(mass, temp);
        const ratio = Math.random();
        const velocityFactor = Math.sqrt((speed ** 2) / (ratio ** 2 + (1 - ratio) ** 2));
        const xNegative = Math.random() >= 0.5 ? -1 : 1;
        const yNegative = Math.random() >= 0.5 ? -1 : 1;
        return [
            velocityFactor * ratio * xNegative / 1000,
            velocityFactor * (1 - ratio) * yNegative / 1000,
        ];
    }
}
