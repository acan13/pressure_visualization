// use this site as a reference to understand collisions of circles
// https://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php?print=1

export const CollisionHelper = {
    updateMoleculesToNextPosition (molecules, container) {
        let timeElapsed = 0;
        const infiniteStopNum = 100;
        let infiniteStopCount = 0;
        while (timeElapsed < 1) {
            let collisions = [];
            let wallCollisions = [];
            const timeRemaining = 1 - timeElapsed;
            infiniteStopCount++;
            if (infiniteStopCount === infiniteStopNum) {
                // console.log('infinite loop');
                // console.log('time elapsed ' + timeElapsed);
                // console.log(molecules);
                // console.log(container);
                return molecules;
            }
            let minTimeStep = timeRemaining;
            for (let i = 0; i < molecules.length; i++) {
                const molecule1 = molecules[i];
                const wallCollisionTime = this._getTimeToWallCollision(molecule1, container, timeRemaining);
                if (wallCollisionTime <= 0) {
                    // nothing
                } else if (wallCollisionTime < minTimeStep) {
                    minTimeStep = wallCollisionTime;
                    wallCollisions = [molecule1];
                    collisions = [];
                } else if (wallCollisionTime === minTimeStep) {
                    wallCollisions.push(molecule1);
                }
                for (let j = i + 1; j < molecules.length; j++) {
                    const molecule2 = molecules[j];
                    const collisionTime = this._getTimeToCollision(molecule1, molecule2, timeRemaining);
                    if (collisionTime <= 0) {
                        // nothing
                    } else if (collisionTime < minTimeStep) {
                        minTimeStep = collisionTime;
                        wallCollisions = [];
                        collisions = [[molecule1, molecule2]];
                    } else if (collisionTime === minTimeStep) {
                        collisions.push([molecule1, molecule2]);
                    }
                }
            }
            molecules.forEach((molecule) => {
                this._moveMolecule(molecule, minTimeStep);
            });
            wallCollisions.forEach((molecule) => {
                this._updateVelocityFromWallCollision(molecule, container);
            });
            collisions.forEach(([mol1, mol2]) => {
                this._updateMoleculeVelocitiesFromCollision(mol1, mol2);
            });
            timeElapsed += minTimeStep;
        }
        container.secondsElapsed++;
        return molecules;
    },
    _getTimeToWallCollision (mol, container, maxTime = 1) {
        let soonestCollision = -1;
        const nextXPosition = mol.position[0] + mol.velocity[0] * maxTime;
        if (nextXPosition < mol.radius) {
            const distanceToBounce = mol.position[0] - mol.radius;
            const timeToCollision = distanceToBounce / Math.abs(mol.velocity[0]);
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        if (nextXPosition > container.width - mol.radius) {
            const distanceToBounce = container.width - mol.radius - mol.position[0];
            const timeToCollision = distanceToBounce / mol.velocity[0];
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        const nextYPosition = mol.position[1] + mol.velocity[1] * maxTime;
        if (nextYPosition < mol.radius) {
            const distanceToBounce = mol.position[1] - mol.radius;
            const timeToCollision = distanceToBounce / Math.abs(mol.velocity[1]);
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        if (nextYPosition > container.height - mol.radius) {
            const distanceToBounce = container.height - mol.radius - mol.position[1];
            const timeToCollision = distanceToBounce / mol.velocity[1];
            if (soonestCollision === -1 || timeToCollision < soonestCollision) {
                soonestCollision = timeToCollision;
            }
        }
        return soonestCollision;
    },
    _getTimeToCollision (mol1, mol2, time = 1) {
        // Early Escape test: if the length of the movevec is less
        // than distance between the centers of these circles minus
        // their radii, there's no way they can hit.
        const moleculeCenterDistance = this._getDistance(mol1.position, mol2.position);
        const sumMoleculeRadii = mol1.radius + mol2.radius;
        const relativeVelocity = this._getRelativeVelocity(mol1.velocity, mol2.velocity).map((val) => {
            return val * time;
        });
        const relativeTravelDistance = this._getDistance(relativeVelocity);
        // if molecules not travelling far enough to collide
        if (relativeTravelDistance < moleculeCenterDistance - sumMoleculeRadii) {
            return -1;
        }

        const normalizedRelativeVelocity = this._getNormalizedVector(relativeVelocity);
        const centerToCenterVector = mol2.position.map((val, index) => {
            return val - mol1.position[index];
        });
        const distanceToClosestPoint = this._getDotProduct(normalizedRelativeVelocity, centerToCenterVector);
        // if molecules not travelling in the right direction to collide
        if (distanceToClosestPoint <= 0) {
            return -1;
        }

        const distanceAtShortestPointSquared = (moleculeCenterDistance ** 2) - (distanceToClosestPoint ** 2);
        const sumMoleculeRadiiSquared = sumMoleculeRadii ** 2;
        if (distanceAtShortestPointSquared >= sumMoleculeRadiiSquared) {
            return -1;
        }

        const offsetSquared = sumMoleculeRadiiSquared - distanceAtShortestPointSquared;
        if (offsetSquared < 0) {
            return -1;
        }

        const distanceToCollision = distanceToClosestPoint - Math.sqrt(offsetSquared);
        if (distanceToCollision > relativeTravelDistance) {
            return -1;
        }

        const timeToCollision = distanceToCollision / relativeTravelDistance;
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
            container.totalTransferredEnergy += Math.abs(mol.velocity[0]) * mol.mass * 1000; // kg * m / s
            mol.velocity[0] *= -1;
        }
        if (mol.position[1] <= mol.radius || mol.position[1] >= container.height - mol.radius) {
            container.totalTransferredEnergy += Math.abs(mol.velocity[1]) * mol.mass * 1000; // kg * m / s
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
            return val / Math.abs(length);
        });
    },
};
