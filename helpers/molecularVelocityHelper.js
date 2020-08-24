import { IDEAL_GAS_CONSTANT } from '../constants';

export const MolecularVelocityHelper = {
    // root mean squared velocity
    // average velocity of all molecules
    // m / s
    getRMSVelocity (mol, temp) {
        return Math.sqrt((3 * IDEAL_GAS_CONSTANT * temp) / mol.mass);
    },
};
