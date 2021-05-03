import { createStore } from 'vuex';
import {
  BestellingInhoud, Persoon, Product, Profiel,
} from '@/model';
import { isOudlid, sum } from '@/util';
import bestelling from '@/store/bestellingen';
import { fetchAuthorized } from '@/fetch';

export default createStore({
  state: () => ({
    profiel: null as Profiel | null,
    personen: {} as Record<string, Persoon>,
    producten: {} as Record<string, Product>,
    selectie: null as Persoon | null,
  }),
  getters: {
    zichtbareProducten: (state) => Object.values(state.producten)
      .filter((p) => p.beheer === '0' && p.status === '1'),
    personenWeergave: (state) => Object.values<Persoon>(state.personen)
      .filter((persoon: Persoon) => persoon.deleted === '0')
      .sort((a, b) => b.recent - a.recent),
  },
  mutations: {
    setProfiel(state, profiel: Profiel) {
      state.profiel = profiel;
    },
    setPersonen(state, personen: Record<string, Persoon>) {
      state.personen = personen;
    },
    setProducten(state, producten: Record<string, Product>) {
      state.producten = producten;
    },
    setSelectie(state, persoon: Persoon) {
      state.selectie = persoon;
    },
  },
  actions: {
    async listUsers({
      commit,
    }): Promise<void> {
      const response = await fetchAuthorized<Persoon[]>({
        url: '/api/v3/bar/personen',
        method: 'POST',
      });

      const personen = Object.values(response);
      const personenRecord = Object.fromEntries(personen.map((p) => [p.socCieId, p]));

      commit('setPersonen', personenRecord);
    },
    async listProducten({
      commit,
    }): Promise<void> {
      const response = await fetchAuthorized<Product[]>({
        url: '/api/v3/bar/producten',
        method: 'POST',
      });

      const producten = Object.values(response);
      const productenRecord = Object.fromEntries(producten.map((p) => [p.productId, p]));

      commit('setProducten', productenRecord);
    },
    async fetchProfiel({
      commit,
    }): Promise<void> {
      const profiel = await fetchAuthorized<Profiel>({
        url: '/api/v3/profiel',
        method: 'GET',
      });

      commit('setProfiel', profiel);
    },
    async postLogin({
      dispatch,
    }): Promise<void> {
      // Dit allemaal tegelijk geeft timing issues op windows...
      await dispatch('fetchProfiel');
      await dispatch('listUsers');
      await dispatch('listProducten');
    },
    async plaatsBestelling(context, {
      persoon,
      inhoud,
      oudeInhoud,
    }: {
      persoon: Persoon
      inhoud: Record<string, BestellingInhoud>
      oudeInhoud: Record<string, BestellingInhoud>
    }): Promise<void> {
      const warningGiven = false;

      const oudLid = isOudlid(persoon);
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

      if (oudLid && toRed) {
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

          const response = await fetchAuthorized<boolean>({
            url: '/api/v3/bar/bestelling',
            method: 'POST',
            data: {
              bestelling: JSON.stringify(result),
            },
          });

          if (!response) {
            throw new Error(`Er ging iets mis! "${response}"`);
          }
        }
      } else if (emptyOrder) {
        throw new Error('Geen bestelling ingevoerd!');
      }
    },
  },
  modules: {
    bestelling,
  },
});
