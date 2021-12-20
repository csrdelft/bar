import {Persoon, Product} from '@/model';
import {fetchAuthorized} from '@/fetch';
import {defineModule} from "@/util";
import Vue from "vue";

export interface ProductenState {
    producten: Record<string, Product>
}

export default defineModule<ProductenState>({
    state: () => ({
        producten: {} as Record<string, Product>,
    }),
    mutations: {
        setProducten(state, producten: Record<string, Product>) {
            state.producten = producten;
        },
    },
    getters: {},
    actions: {

    },
});
