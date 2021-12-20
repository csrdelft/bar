import {Persoon} from '@/model';
import {Module} from "vuex";

export const throwError = (msg: string): never => {
    throw new Error(msg);
};

export const formatBedrag = (bedrag: number): string => {
    let achterKomma = String(Math.abs(bedrag % 100));
    if (achterKomma === '0') {
        achterKomma = '00';
    } else if (Number(achterKomma) < 10) {
        achterKomma = `0${achterKomma}`;
    }

    if (bedrag > -100 && bedrag < 0) return `€-0,${achterKomma}`;

    const string = `€${(bedrag - (bedrag % 100)) / 100},${achterKomma}`;

    return string.replace('€-', '-€');
};

export const sum = (...args: number[]): number => args.reduce((a, b) => a + b, 0);

export const isOudlid = (persoon: Persoon): boolean => persoon.status !== 'S_LID' && persoon.status !== 'S_GASTLID' && persoon.status !== 'S_NOVIET';

export class SaldoError extends Error {
}

export const groupBy = <T>(elements: T[], key: keyof T) => Object.fromEntries(elements.map(el => [el[key], el]))

/**
 * For Vuex Modules
 * @param tree
 */
export const defineModule = <T, R = unknown>(tree: Module<T, R>): Module<T, R> => tree;
