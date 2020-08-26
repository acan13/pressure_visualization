<template>
    <div class="parameter-form-wrapper">
        <FormulateInput v-model.number="temperature" type="number" label="Temperature"/>
        <FormulateInput v-model="temperatureUnit" type="select" :options="{kelvin: 'K', celsius: 'C', fahrenheit: 'F', rankine: 'R'}"/>
        <FormulateInput v-model="moleculeType" type="select" label="Molecule" :options="{oxygen: 'Oxygen'}"/>
        <FormulateInput v-model.number="mols" type="number" label="Number of Balls"/>
    </div>
</template>

<script>
export default {
    data () {
        return {
            temperature: 298,
            temperatureUnit: 'fahrenheit',
            moleculeType: 'oxygen',
            mols: 100,
        };
    },
};
</script>

<style>

</style>
