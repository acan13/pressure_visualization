<template>
    <div class="visualization">
        <div class="molecule" :style="moleculeStyle1"/>
        <div class="molecule" :style="moleculeStyle2"/>
    </div>
</template>

<script>
import { Molecule } from '../models/Molecule';
import { Container } from '../models/Container';
export default {
    props: {
        container: {
            type: Container,
            required: true,
        },
    },
    data () {
        return {
            m1: new Molecule(1, 50, 50, 0.4, 0.2, 5),
            m2: new Molecule(1, 20, 20, 0.3, 0.4, 5),
        };
    },
    computed: {
        moleculeStyle1 () {
            return {
                left: `${this.m1.x}px`,
                top: `${this.m1.y}px`,
                'border-width': '5px',
                'border-color': 'blue',
                'border-style': 'solid',
                'border-radius': '5px',
            };
        },
        moleculeStyle2 () {
            return {
                left: `${this.m2.x}px`,
                top: `${this.m2.y}px`,
                'border-width': '5px',
                'border-color': 'red',
                'border-style': 'solid',
                'border-radius': '5px',
            };
        },
    },
    mounted () {
        setInterval(() => {
            this.m1.x += this.m1.velocityX;
            this.m1.y += this.m1.velocityY;
            if (this.m1.x >= this.container.width - this.m1.radius * 2 || this.m1.x <= 0) {
                this.m1.velocityX *= -1;
            }
            if (this.m1.y >= this.container.height - this.m1.radius * 2 || this.m1.y <= 0) {
                this.m1.velocityY *= -1;
            }
            this.m2.x += this.m2.velocityX;
            this.m2.y += this.m2.velocityY;
            if (this.m2.x >= this.container.width - this.m2.radius * 2 || this.m2.x <= 0) {
                this.m2.velocityX *= -1;
            }
            if (this.m2.y >= this.container.height - this.m2.radius * 2 || this.m2.y <= 0) {
                this.m2.velocityY *= -1;
            }
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
