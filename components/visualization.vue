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
            m1: new Molecule(1, 50, 50, 0.4, 0.2, 5),
            m2: new Molecule(1, 20, 20, 0.3, 0.4, 5),
        };
    },
    computed: {
        moleculeStyle1 () {
            return {
                left: `${this.m1.position[0]}px`,
                top: `${this.m1.position[1]}px`,
                'border-width': '5px',
                'border-color': 'blue',
                'border-style': 'solid',
                'border-radius': '5px',
            };
        },
        moleculeStyle2 () {
            return {
                left: `${this.m2.position[0]}px`,
                top: `${this.m2.position[1]}px`,
                'border-width': '5px',
                'border-color': 'red',
                'border-style': 'solid',
                'border-radius': '5px',
            };
        },
    },
    mounted () {
        const vm = this;
        setInterval(() => {
            const collisionVelocityRatio = CollisionHelper.getVelocityCollisionRatio(vm.m1, vm.m2);
            if (collisionVelocityRatio === -1) {
                vm.$set(vm.m1.position, 0, vm.m1.position[0] + vm.m1.velocity[0]);
                vm.$set(vm.m1.position, 1, vm.m1.position[1] + vm.m1.velocity[1]);
                vm.$set(vm.m2.position, 0, vm.m2.position[0] + vm.m2.velocity[0]);
                vm.$set(vm.m2.position, 1, vm.m2.position[1] + vm.m2.velocity[1]);
            } else {
                console.log("intersection")
            }
        }, 500);
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
