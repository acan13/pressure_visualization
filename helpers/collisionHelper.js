// use this site as a reference to understand collisions of circles
// https://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php?print=1

export const CollisionHelper = {
    getVelocityCollisionRatio (mol1, mol2) {
        const moleculeCenterDistance = this._getDistance(mol1.position, mol2.position);
        const sumMoleculeRadii = mol1.radius + mol2.radius;
        const relativeVelocity = this._getRelativeVelocity(mol1.velocity, mol2.velocity);
        const relativeMoveDistance = this._getDistance(relativeVelocity);

        // if distance traveled is less than distance apart minus sum of radii then no collision can occur
        if (relativeMoveDistance < moleculeCenterDistance - sumMoleculeRadii) {
            return -1;
        }

        const vectorFromMol1ToMol2 = mol2.position.map((val, index) => {
            return val - mol1.position[index];
        });
        const relativeSpeedInDirectionFromMol1ToMol2 = this._getDotProduct(relativeVelocity, vectorFromMol1ToMol2);

        // if relativeSpeedInDirectionFromMol1ToMol2 is negative or 0 then the molecules are not moving towards each other
        if (relativeSpeedInDirectionFromMol1ToMol2 <= 0) {
            return -1;
        }

        // use pythagorean theorem to find center distance at closest point
        // don't take square root to avoid processing time
        const closestCenterDistanceSquared = moleculeCenterDistance ^ 2 - relativeSpeedInDirectionFromMol1ToMol2 ^ 2;

        const sumMoleculeRadiiSquared = sumMoleculeRadii ^ 2;

        // if the distance at the closest point is greater than or equal to sum of radii then no collision
        if (closestCenterDistanceSquared >= sumMoleculeRadiiSquared) {
            return -1;
        }

        const intersectionDistanceOffsetSquared = sumMoleculeRadiiSquared - closestCenterDistanceSquared;
        const relativeDistanceToCollision = relativeSpeedInDirectionFromMol1ToMol2 - Math.sqrt(intersectionDistanceOffsetSquared);
        const velocityCollisionRatio = relativeDistanceToCollision / relativeSpeedInDirectionFromMol1ToMol2;

        return velocityCollisionRatio;
    },
    _getRelativeVelocity (mol1, mol2) {
        const relativeVelocityX = mol1.velocityX - mol2.velocityX;
        const relativeVelocityY = mol1.velocityY - mol2.velocityY;
        return [relativeVelocityX, relativeVelocityY];
    },
    _getDotProduct (v1, v2) {
        let sum = 0;
        for (let i = 0; i < v1.length; i++) {
            sum += v1[i] * v2[i];
        }
        return sum;
    },
    _getDistance (p1, p2 = [0, 0, 0]) {
        let sumSquares = 0;
        for (let i = 0; i < p1.length; i++) {
            sumSquares += (p2[i] - p1[i]) ^ 2;
        }
        return Math.sqrt(sumSquares);
    },
    _getNormalizedVector (vector, length = 0) {
        length = length || this._getDistance(vector);
        return vector.map((val) => {
            return val / length;
        });
    },
};
