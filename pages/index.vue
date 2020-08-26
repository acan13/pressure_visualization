<template>
    <div class="page-wrapper">
        <ac-viz-container/>
        <ac-parameter-form/>
    </div>
</template>

<script>
import visualizationContainerVue from '../components/visualizationContainer.vue';
import parameterFormVue from '../components/parameterForm.vue';
export default {
    components: {
        'ac-viz-container': visualizationContainerVue,
        'ac-parameter-form': parameterFormVue,
    },
};
</script>

<style>

</style>
