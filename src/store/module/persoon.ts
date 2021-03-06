import {Persoon} from '@/model';
import {fetchAuthorized} from '@/util/fetch';
import {defineModule} from "@/util/util";
import Vue from "vue";

export default defineModule({
  state: () => ({
    personen: {} as Record<string, Persoon>,
  }),
  mutations: {
    setPersonen(state, personen: Record<string, Persoon>) {
      state.personen = personen;
    },
    setPersoon(state, persoon: Persoon) {
      Vue.set(state.personen, persoon.uid, persoon)
    }
  },
  getters: {
    personenWeergave: (state) => Object.values<Persoon>(state.personen)
        .filter((p: Persoon) => !p.deleted)
        .sort((a, b) => a.recent - b.recent)
        .reverse(),
  },
  actions: {
    async listUsers({commit}): Promise<void> {
      const response = await fetchAuthorized<Persoon[]>({
        url: '/api/v3/bar/personen',
        method: 'POST',
      });

      const personen = Object.values(response);
      const personenRecord = Object.fromEntries(personen.map((p, i) => [p.uid, {...p}]));

      commit('setPersonen', personenRecord);
    },
    async updateBijnaam({commit, state}, {
      id,
      name,
    }: { id: string, name: string }): Promise<void> {
      await fetchAuthorized<void>({
        url: '/api/v3/bar/updatePerson',
        method: 'POST',
        body: JSON.stringify({id, name,})
      })

      commit('setPersoon', {
        ...state.personen[id],
        naam: name,
      })
    }
  },
});
