<template>
    <div class="visualization">
        <div class="molecule" :style="moleculeStyle1"/>
        <div class="molecule" :style="moleculeStyle2"/>
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
            m1: new Molecule(1, 50, 20, -0.5, 0, 5),
            m2: new Molecule(1, 20, 20, 0.5, 0, 5),
        };
    },
    computed: {
        moleculeStyle1 () {
            return {
                left: `${this.m1.position[0] - this.m1.radius}px`,
                top: `${this.m1.position[1] - this.m2.radius}px`,
                'border-width': '5px',
                'border-color': 'blue',
                'border-style': 'solid',
                'border-radius': '5px',
            };
        },
        moleculeStyle2 () {
            return {
                left: `${this.m2.position[0] - this.m2.radius}px`,
                top: `${this.m2.position[1] - this.m2.radius}px`,
                'border-width': '5px',
                'border-color': 'red',
                'border-style': 'solid',
                'border-radius': '5px',
            };
        },
    },
    mounted () {
        const m1 = new Molecule(1, 50, 20, -0.5, 0.5, 5, 'red');
        const m2 = new Molecule(1, 20, 20, 0.5, -0.2, 5, 'blue');
        setInterval(() => {
            this.m1 = new Molecule(m1.mass, m1.position[0], m1.position[1], m1.velocity[0], m1.velocity[1], m1.radius, m1.color);
            this.m2 = new Molecule(m2.mass, m2.position[0], m2.position[1], m2.velocity[0], m2.velocity[1], m2.radius, m2.color);
            CollisionHelper.updateMoleculesToNextPosition([m1, m2], this.container);
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
