import {Product} from '@/model';
import {defineModule} from "@/util";

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
  actions: {},
});
