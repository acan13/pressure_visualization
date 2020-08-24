export const TemperatureHelper = {
    convertCtoK (temp) {
        return temp + 273.15;
    },
    convertFtoR (temp) {
        return temp + 459.67;
    },
    convertFtoK (temp) {
        return this.convertFtoR(temp) * 5 / 9;
    },
};
