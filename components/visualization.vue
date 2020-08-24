<template>
    <div class="visualization">
        <div v-for="(mol, index) in molecules" :key="index" class="molecule" :style="moleculeStyles[index]"/>
    </div>
</template>

<script>
import { Molecule } from '../models/Molecule';
import { Container } from '../models/Container';
import { CollisionHelper } from '../helpers/collisionHelper';
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
        const molecules = [
            new Molecule({
                mass: 32,
                positionX: 100,
                positionY: 100,
                radius: 5,
                color: 'red',
            }),
            new Molecule({
                mass: 32,
                positionX: 200,
                positionY: 200,
                radius: 5,
                color: 'green',
            }),
            new Molecule({
                mass: 32,
                positionX: 250,
                positionY: 250,
                radius: 5,
                color: 'yellow',
            }),
            new Molecule({
                mass: 32,
                positionX: 270,
                positionY: 270,
                radius: 5,
                color: 'orange',
            }),
            new Molecule({
                mass: 32,
                positionX: 280,
                positionY: 280,
                radius: 5,
                color: 'purple',
            }),
            new Molecule({
                mass: 32,
                positionX: 290,
                positionY: 290,
                radius: 5,
                color: 'lawngreen',
            }),
            new Molecule({
                mass: 32,
                positionX: 20,
                positionY: 20,
                radius: 5,
                color: 'lightblue',
            }),
            new Molecule({
                mass: 32,
                positionX: 30,
                positionY: 30,
                radius: 7,
                color: 'grey',
            }),
        ];
        console.log(molecules[0]);
        molecules.forEach((mol, index) => {
            this.molecules.push(new Molecule({ mass: mol.mass, positionX: mol.position[0], positionY: mol.position[1], radius: mol.radius, color: mol.color, velocityX: mol.velocity[0], velocityY: mol.velocity[1] }));
        });
        setInterval(() => {
            molecules.forEach((mol, index) => {
                this.$set(this.molecules, index, new Molecule({ mass: mol.mass, positionX: mol.position[0], positionY: mol.position[1], radius: mol.radius, color: mol.color, velocityX: mol.velocity[0], velocityY: mol.velocity[1] }));
            });
            CollisionHelper.updateMoleculesToNextPosition(molecules, this.container);
        }, 0);
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
