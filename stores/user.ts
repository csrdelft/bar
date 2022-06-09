import { defineStore } from "pinia";
import { Data as OAuth2Data } from "client-oauth2";
import { BarLocatie } from "../types/barLocatie";
import { Profiel } from "../types/profiel";
import fetchAuthorized from "../util/fetch";
import { useToken } from "../composables/useToken";

interface UserState {
  profiel: Profiel | null;
  tokenData: OAuth2Data | null;
  selectie: string | null;
  locatieToken: BarLocatie | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    profiel: null,
    tokenData: null,
    selectie: null,
    locatieToken: null,
  }),

  getters: {
    token: (state: UserState) => {
      const { createToken } = useToken();
      return createToken(state.tokenData);
    },
    rechten: (state: UserState) => ({
      admin: state.profiel?.scopes.includes("BAR:TRUST") ?? false,
      beheer: state.profiel?.scopes.includes("BAR:BEHEER") ?? false,
    }),
  },

  actions: {
    setToken(token: OAuth2Data | null) {
      this.tokenData = token;

      const { setToken, removeToken } = useToken();

      if (token) {
        setToken(token);
      } else {
        removeToken();
      }
    },
    setLocatieToken(token: BarLocatie | null) {
      this.locatieToken = token;

      const { setLocatieToken, removeLocatieToken } = useToken();

      if (token) {
        setLocatieToken(token);
      } else {
        removeLocatieToken();
      }
    },
    setProfiel(profiel: Profiel) {
      this.profiel = profiel;
    },
    setSelectie(persoonId: string | null) {
      this.selectie = persoonId;
    },

    async fetchProfiel(): Promise<void> {
      const profiel = await fetchAuthorized<Profiel>({
        url: "/api/v3/profiel",
        method: "GET",
      });

      this.setProfiel(profiel);
    },
  },
});

