// use this site as a reference to understand collisions of circles
// https://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php?print=1

export const CollisionHelper = {
    updateMoleculesToNextPosition (molecules, container) {
        let collisions = [];
        let wallCollisions = [];
        let timeElapsed = 0;
        while (timeElapsed < 1) {
            let firstCollisionTime = 1;
            for (let i = 0; i < molecules.length; i++) {
                const molecule1 = molecules[i];
                const wallCollisionTime = this._getTimeToWallCollision(molecule1, container, 1 - timeElapsed);
                if (wallCollisionTime === -1) {
                    // nothing
                } else if (wallCollisionTime < firstCollisionTime) {
                    firstCollisionTime = wallCollisionTime;
                    wallCollisions = [molecule1];
                    collisions = [];
                } else if (wallCollisionTime === firstCollisionTime) {
                    wallCollisions.push(molecule1);
                }
                for (let j = i + 1; j < molecules.length; j++) {
                    const molecule2 = molecules[j];
                    const collisionTime = this._getTimeToCollision(molecule1, molecule2, 1 - timeElapsed);
                    if (collisionTime === -1) {
                        // nothing
                    } else if (collisionTime < firstCollisionTime) {
                        wallCollisions = [];
                        collisions = [[molecule1, molecule2]];
                    } else if (collisionTime === firstCollisionTime) {
                        collisions.push([molecule1, molecule2]);
                    }
                }
            }
            molecules.forEach((molecule) => {
                this._moveMolecule(molecule, firstCollisionTime);
            });
            wallCollisions.forEach((molecule) => {
                this._updateVelocityFromWallCollision(molecule, container);
            });
            collisions.forEach(([mol1, mol2]) => {
                this._updateMoleculeVelocitiesFromCollision(mol1, mol2);
            });
            timeElapsed += firstCollisionTime;
        }
        return molecules;
    },
    _getTimeToWallCollision (mol, container, time = 1) {
        let soonestCollision = -1;
        const nextXPosition = mol.position[0] + mol.velocity[0] * time;
        if (nextXPosition < mol.radius) {
            const distancePastBounce = nextXPosition - mol.radius;
            const timeToCollision = (mol.velocity[0] * time - distancePastBounce) / (mol.velocity[0] * time);
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        if (nextXPosition > container.width - mol.radius) {
            const distancePastBounce = nextXPosition - container.width + mol.radius;
            const timeToCollision = (mol.velocity[0] * time - distancePastBounce) / (mol.velocity[0] * time);
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        const nextYPosition = mol.position[1] + mol.velocity[1] * time;
        if (nextYPosition < mol.radius) {
            const distancePastBounce = nextYPosition - mol.radius;
            const timeToCollision = (mol.velocity[1] * time - distancePastBounce) / (mol.velocity[1] * time);
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        if (nextYPosition > container.height - mol.radius) {
            const distancePastBounce = nextYPosition - container.height + mol.radius;
            const timeToCollision = (mol.velocity[1] * time - distancePastBounce) / (mol.velocity[1] * time);
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        return soonestCollision;
    },
    _getTimeToCollision (mol1, mol2, time = 1) {
        const moleculeCenterDistance = this._getDistance(mol1.position, mol2.position);
        const sumMoleculeRadii = mol1.radius + mol2.radius;
        const relativeVelocity = this._getRelativeVelocity(mol1.velocity, mol2.velocity).map((val) => {
            return val * time;
        });
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
        const closestCenterDistanceSquared = moleculeCenterDistance ** 2 - relativeSpeedInDirectionFromMol1ToMol2 ** 2;

        const sumMoleculeRadiiSquared = sumMoleculeRadii ** 2;

        // if the distance at the closest point is greater than or equal to sum of radii then no collision
        if (closestCenterDistanceSquared >= sumMoleculeRadiiSquared) {
            return -1;
        }

        const intersectionDistanceOffsetSquared = sumMoleculeRadiiSquared - closestCenterDistanceSquared;
        const relativeDistanceToCollision = relativeSpeedInDirectionFromMol1ToMol2 - Math.sqrt(intersectionDistanceOffsetSquared);
        const timeToCollision = relativeDistanceToCollision / relativeSpeedInDirectionFromMol1ToMol2;

        return timeToCollision;
    },
    _updateMoleculeVelocitiesFromCollision (mol1, mol2) {
        // calculate new velocities
        const centerToCenterVector = mol1.position.map((val, index) => {
            return val - mol2.position[index];
        });
        const normalizedCenterToCenterVector = this._getNormalizedVector(centerToCenterVector);
        const a1 = this._getDotProduct(mol1.velocity, normalizedCenterToCenterVector);
        const a2 = this._getDotProduct(mol2.velocity, normalizedCenterToCenterVector);
        const P = (2 * (a1 - a2)) / (mol1.mass + mol2.mass);
        mol1.velocity = mol1.velocity.map((val, index) => {
            return val - P * mol2.mass * normalizedCenterToCenterVector[index];
        });
        mol2.velocity = mol2.velocity.map((val, index) => {
            return val + P * mol1.mass * normalizedCenterToCenterVector[index];
        });
    },
    _updateVelocityFromWallCollision (mol, container) {
        if (mol.position[0] <= mol.radius || mol.position[0] >= container.width - mol.radius) {
            mol.velocity[0] *= -1;
        }
        if (mol.position[1] <= mol.radius || mol.position[1] >= container.height - mol.radius) {
            mol.velocity[1] *= -1;
        }
    },
    _moveMolecule (mol, time = 1) {
        mol.velocity.forEach((velocity, index) => {
            mol.position[index] += velocity * time;
        });
    },
    _getRelativeVelocity (v1, v2 = [0, 0, 0]) {
        return v1.map((val, index) => {
            return val - v2[index];
        });
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
            sumSquares += (p2[i] - p1[i]) ** 2;
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
