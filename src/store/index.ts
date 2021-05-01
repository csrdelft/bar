import { createStore } from 'vuex';
import {
  BestellingInhoud, Persoon, Product, Profiel,
} from '@/model';
import { Data, Token } from 'client-oauth2';
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import VuexPersist from 'vuex-persist';
import csrAuth from '@/auth/csrAuth';
import { isOudlid, sum, throwError } from '@/util';

const vuexLocalStorage = new VuexPersist<{ token: Data | null }>({
  key: 'vuex',
  storage: window.localStorage,
  // Alleen token opslaan in localStorage
  reducer: ({ token }) => ({ token }),
});

/**
 * Deze variant van fetch stopt de token in iedere request en gooit de token weg als er iets
 * mis gaat.
 * @param state
 * @param commit
 */
const getFetch = (state: { token: Data | null }, commit: (action: string) => unknown) => {
  const token = (state.token ? new Token(csrAuth, state.token) : throwError('Geen token'));

  return <T>(requestObj: AxiosRequestConfig & { url: string }): AxiosPromise<T> => axios(
    token.sign({
      ...requestObj,
      url: process.env.VUE_APP_REMOTE_URL + requestObj.url,
    }),
  )
    .catch((response: AxiosError<T>) => {
      // Status 500 of 401
      if (response.response) {
        commit('invalidateToken');
        return response.response;
      }

      // Waarschijnlijk 'Network Error'
      throw new Error(response.message);
    });
};

export default createStore({
  plugins: [vuexLocalStorage.plugin],
  state: () => ({
    zoeken: '',
    profiel: null as Profiel | null,
    token: null as Data | null,
    personen: {} as Record<string, Persoon>,
    producten: {} as Record<string, Product>,
  }),
  getters: {
    zichtbareProducten: (state) => Object.values(state.producten)
      .filter((p) => p.beheer === '0' && p.status === '1'),
  },
  mutations: {
    setZoeken(state, value: string) {
      state.zoeken = value;
    },
    setProfiel(state, profiel: Profiel) {
      state.profiel = profiel;
    },
    setToken(state, token: Token) {
      state.token = token.data;
    },
    setPersonen(state, personen: Record<string, Persoon>) {
      state.personen = personen;
    },
    setProducten(state, producten: Record<string, Product>) {
      state.producten = producten;
    },
    invalidateToken(state) {
      state.token = null;
    },
  },
  actions: {
    async listUsers({
      state,
      commit,
    }): Promise<void> {
      const fetch = getFetch(state, commit);
      const response = await fetch<Persoon[]>({
        url: '/api/v3/bar/personen',
        method: 'POST',
      });

      const personen = Object.values(response.data);
      const personenRecord = Object.fromEntries(personen.map((p) => [p.socCieId, p]));

      commit('setPersonen', personenRecord);
    },
    async listProducten({
      state,
      commit,
    }): Promise<void> {
      const fetch = getFetch(state, commit);
      const response = await fetch<Product[]>({
        url: '/api/v3/bar/producten',
        method: 'POST',
      });

      const producten = Object.values(response.data);
      const productenRecord = Object.fromEntries(producten.map((p) => [p.productId, p]));

      commit('setProducten', productenRecord);
    },
    async fetchProfiel({
      state,
      commit,
    }): Promise<void> {
      const fetch = getFetch(state, commit);

      const response = await fetch<Profiel>({
        url: '/api/v3/profiel',
        method: 'GET',
      });

      commit('setProfiel', response.data);
    },
    async postLogin({
      dispatch,
      commit,
    }, token?: Token): Promise<void> {
      if (token) {
        commit('setToken', token);
      }

      // Dit allemaal tegelijk geeft timing issues op windows...
      await dispatch('fetchProfiel');
      await dispatch('listUsers');
      await dispatch('listProducten');
    },
    async plaatsBestelling({
      state,
      commit,
    }, {
      persoon,
      inhoud,
      oudeInhoud,
    }: {
      persoon: Persoon
      inhoud: Record<string, BestellingInhoud>
      oudeInhoud: Record<string, BestellingInhoud>
    }):
      Promise<void> {
      const fetch = getFetch(state, commit);
      const warningGiven = false;

      const oudlid = isOudlid(persoon);
      const totaal = sum(...Object.values(inhoud)
        .map((i) => i.aantal * Number(i.product.prijs)));

      let toRed;
      if (oudeInhoud) {
        const oudTotaal = sum(...Object.values(oudeInhoud)
          .map((i) => i.aantal * Number(i.product.prijs)));
        toRed = persoon.saldo + oudTotaal - totaal < 0;
      } else {
        toRed = persoon.saldo - totaal < 0;
      }

      // noinspection PointlessBooleanExpressionJS
      if (totaal <= 0 || persoon.status === 'S_NOBODY' || /* TODO: beheer */ false) {
        toRed = false;
      }

      const emptyOrder = Object.values(inhoud).length === 0;

      if (oudlid && toRed) {
        throw new Error('Oudleden kunnen niet rood staan, inleg vereist!');
      } else if (persoon && !emptyOrder) {
        if (!warningGiven && toRed) {
          // TODO: Timeout!
          throw new Error('Laat lid inleggen. Saldo wordt negatief.');
        } else {
          // Set submitting state on true

          const result = {
            persoon,
            bestelTotaal: totaal,
            bestelLijst: Object.fromEntries(Object.values(inhoud)
              .map((i) => [i.product.productId, i.aantal])),
            oudeBestelling: oudeInhoud,
          };

          try {
            const response = await fetch({
              url: '/api/v3/bar/bestelling',
              method: 'POST',
              data: {
                bestelling: JSON.stringify(result),
              },
            });

            if (response.data !== true) {
              throw new Error(`Er ging iets mis! "${response.data}"`);
            }
          } catch (e) {
            throw new Error(e.message);
          }
        }
      } else if (emptyOrder) {
        throw new Error('Geen bestelling ingevoerd!');
      }
    },
  },
  modules: {},
});
