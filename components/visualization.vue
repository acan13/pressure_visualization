<template>
    <div class="visualization">
        <div v-for="(mol, index) in molecules" :key="index" class="molecule" :style="moleculeStyles[index]"/>
    </div>
</template>

<script>
import { Molecule } from '../models/Molecule';
import { Container } from '../models/Container';
import { CollisionHelper } from '../helpers/collisionHelper';
import { IdealGasHelper } from '../helpers/idealGasHelper';
import { IDEAL_GAS_CONSTANT } from '../constants';
export default {
    props: {
        container: {
            type: Container,
            required: true,
        },
    },
    data () {
        return {
            molecules: [],
        };
    },
    computed: {
        moleculeStyles () {
            return this.molecules.map((mol) => {
                return {
                    left: `${mol.position[0] - mol.radius}px`,
                    top: `${mol.position[1] - mol.radius}px`,
                    'border-width': `${mol.radius}px`,
                    'border-color': `${mol.color}`,
                    'border-style': 'solid',
                    'border-radius': `${mol.radius}px`,
                };
            });
        },
    },
    mounted () {
        // const molecules = [
        //     new Molecule({
        //         mass: 32,
        //         positionX: 50,
        //         positionY: 50,
        //         radius: 20,
        //         color: 'red',
        //         velocityX: 0.5,
        //         velocityY: 0,
        //     }),
        //     new Molecule({
        //         mass: 32,
        //         positionX: 100,
        //         positionY: 50,
        //         radius: 20,
        //         color: 'red',
        //         velocityX: -0.5,
        //         velocityY: 0.001,
        //     }),
        // ];

        const molecules = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                molecules.push(new Molecule({
                    mass: 32,
                    positionX: (200 / 10) * i + 5,
                    positionY: (200 / 10) * j + 5,
                    radius: 2,
                    color: 'green',
                    temp: 5000,
                }));
            }
        }
        molecules.forEach((mol, index) => {
            this.molecules.push(new Molecule({ mass: mol.mass, positionX: mol.position[0], positionY: mol.position[1], radius: mol.radius, color: mol.color, velocityX: mol.velocity[0], velocityY: mol.velocity[1] }));
        });
        setInterval(() => {
            molecules.forEach((mol, index) => {
                this.$set(this.molecules, index, new Molecule({ mass: mol.mass, positionX: mol.position[0], positionY: mol.position[1], radius: mol.radius, color: mol.color, velocityX: mol.velocity[0], velocityY: mol.velocity[1] }));
            });
            CollisionHelper.updateMoleculesToNextPosition(molecules, this.container);
        }, 1 * 1000);
    },
};
</script>

<style lang="scss">
    .visualization {
        position: absolute;

        .molecule {
            position: absolute;
            box-sizing: border-box;
        }
    }
</style>
