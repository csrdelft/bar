import {Persoon} from '@/model';
import {fetchAuthorized} from '@/fetch';
import {defineModule} from "@/util";
import Vue from "vue";

export interface PersonenState {
    personen: Record<string, Persoon>
}

export default defineModule<PersonenState>({
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
    getters: {},
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
                data: {
                    id,
                    name,
                }
            })

            commit('setPersoon', {
                ...state.personen[id],
                naam: name,
            })
        }
    },
});
