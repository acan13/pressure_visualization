<template>
    <div class="visualization-container-wrapper" :style="containerStyle">
        <ac-visualization :container="container"/>
    </div>
</template>

<script>
import { Container } from '../models/Container';
import visualizationVue from './visualization.vue';
export default {
    components: {
        'ac-visualization': visualizationVue,
    },
    data () {
        return {
            container: new Container(200, 200),
        };
    },
    computed: {
        containerStyle () {
            return {
                height: `${this.container.height}px`,
                width: `${this.container.width}px`,
            };
        },
    },
};
</script>

<style lang="scss">
    .visualization-container-wrapper {
        border-width: 5px;
        border-color: red;
        border-style: solid;
        margin-left: 50px;
    }
</style>
