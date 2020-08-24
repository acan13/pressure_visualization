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
            new Molecule(1, 50, 20, -0.5, 0.5, 5, 'red'),
            new Molecule(1, 20, 20, 0.5, -0.2, 5, 'blue'),
            new Molecule(10, 20, 50, 0.5, -0.2, 5, 'green'),
            new Molecule(10, 40, 10, 0.5, -0.2, 10, 'orange'),
        ];
        molecules.forEach((mol, index) => {
            this.molecules.push(new Molecule(mol.mass, mol.position[0], mol.position[1], mol.velocity[0], mol.velocity[1], mol.radius, mol.color));
        });
        setInterval(() => {
            molecules.forEach((mol, index) => {
                this.$set(this.molecules, index, new Molecule(mol.mass, mol.position[0], mol.position[1], mol.velocity[0], mol.velocity[1], mol.radius, mol.color));
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
