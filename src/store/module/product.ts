import {Product} from '@/model';
import {defineModule} from "@/util/util";

export default defineModule({
  state: () => ({
    producten: {} as Record<string, Product>,
  }),
  mutations: {
    setProducten(state, producten: Record<string, Product>) {
      state.producten = producten;
    },
  },
  getters: {
    zichtbareProducten: (state) => Object.values(state.producten)
        .filter((p) => !p.beheer && p.status === 1),
  },
  actions: {},
});
