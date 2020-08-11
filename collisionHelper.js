const CollisionHelper = {
    // axis-aligned bounding box
    AABBOverlap: function (molecule1, molecule2) {
        return molecule1.x + molecule1.radius + molecule2.radius > molecule2.x &&
            molecule1.x < molecule2.x + molecule1.radius + molecule2.radius &&
            molecule1.y + molecule1.radius + molecule2.radius > molecule2.y &&
            molecule1.y < seconBall.y + molecule1.radius + molecule2.radius;
    },
    moleculeDistance: function (modecule1, molecule2) {
        return Math.sqrt(
            ((modecule1.x - molecule2.x) * (modecule1.x - molecule2.x)) +
            ((modecule1.y - molecule2.y) * (modecule1.y - molecule2.y))
        );
    },
    moleculesHaveCollided: function (molecule1, molecule2) {
        return molecule1.radius + molecule2.radius >= this.moleculeDistance(molecule1, molecule2);
    },
    getCollisionPoint: function (molecule1, molecule2) {
        const x = ((molecule1.x * molecule2.radius) + (molecule2.x * molecule1.radius)) / (molecule1.radius + molecule2.radius);
        const y = ((molecule1.y * molecule2.radius) + (molecule2.y * molecule1.radius)) / (molecule1.radius + molecule2.radius);
        return [x, y];
    },
    getMoleculeVelocitiesFromCollision: function (molecule1, molecule2) {
        const newVelX1 = (molecule1.velocityX * (molecule1.mass - molecule2.mass) + (2 * molecule2.mass * molecule2.velocityX)) / (molecule1.mass + molecule2.mass);
        const newVelY1 = (molecule1.velocityY * (molecule1.mass - molecule2.mass) + (2 * molecule2.mass * molecule2.velocityY)) / (molecule1.mass + molecule2.mass);
        const newVelX2 = (molecule2.velocityX * (molecule2.mass - molecule1.mass) + (2 * molecule1.mass * molecule1.velocityX)) / (molecule1.mass + molecule2.mass);
        const newVelY2 = (molecule2.velocityY * (molecule2.mass - molecule1.mass) + (2 * molecule1.mass * molecule1.velocityY)) / (molecule1.mass + molecule2.mass);
        return [
            [newVelX1, newVelY1],
            [newVelX2, newVelY2]
        ];
    },
    moleculeHasCollidedWithContainer: function(molecule, container) {
        const collidedWithLeftWall = molecule.x < molecule.radius;
        const collidedWithBottomWall = molecule.y < molecule.radius;
        const collidedWithRightWall = molecule.x > container.width - molecule.radius;
        const collidedWithTopWall = molecule.y > container.height - molecule.radius;
        return {
            collidedWithLeftWall,
            collidedWithBottomWall,
            collidedWithRightWall,
            collidedWithTopWall,
            collidedWithContainer: collidedWithLeftWall || collidedWithBottomWall || collidedWithRightWall || collidedWithTopWall,
        };
    },
    getMoleculeVelocityFromWallCollision: function (molecule, container) {
        const collisions = this.moleculeHasCollidedWithContainer(molecule, container);
        if (!collisions.collidedWithContainer) {
            return molecule;
        }
        if (collisions.collidedWithLeftWall || collisions.collidedWithRightWall) {
            molecule.velocityX *= -1;
        }
        if (collisions.collidedWithBottomWall || collisions.collidedWithTopWall) {
            molecule.velocityY *= -1;
        }
        return molecule;
    },
}