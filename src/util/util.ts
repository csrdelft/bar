import {Persoon} from '@/model';
import {Module} from "vuex";

export const isOudlid = (persoon: Persoon): boolean => persoon.status !== 'S_LID' && persoon.status !== 'S_GASTLID' && persoon.status !== 'S_NOVIET';

export class SaldoError extends Error {
}

/**
 * For Vuex Modules
 * @param tree
 */
export const defineModule = <T, R = unknown>(tree: Module<T, R>): Module<T, R> => tree;
