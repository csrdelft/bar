import { defineStore } from "pinia";
import { Data as OAuth2Data } from "client-oauth2";
import { BarLocatie } from "~/types/barLocatie";
import { Profiel } from "~/types/profiel";
import fetchAuthorized from "~/util/fetch";
import { useToken } from "~/composables/useToken";

export const useUserStore = defineStore("user", () => {
  // MARK: State
  const profiel = ref<Profiel | null>(null);
  const tokenData = ref<OAuth2Data | null>(null);
  const selectie = ref<string | null>(null);
  const locatieToken = ref<BarLocatie | null>(null);

  // MARK: Getters
  const token = computed(() => {
    const { createToken } = useToken();
    return createToken(tokenData.value);
  });
  const rechten = computed(() => ({
    admin: profiel.value?.scopes.includes("BAR:TRUST") ?? false,
    beheer: profiel.value?.scopes.includes("BAR:BEHEER") ?? false,
  }));

  // MARK: Actions/Mutations
  function setToken(token: OAuth2Data | null) {
    tokenData.value = token;

    const { setToken, removeToken } = useToken();

    if (token) {
      setToken(token);
    } else {
      removeToken();
    }
  }
  function setLocatieToken(token: BarLocatie | null) {
    locatieToken.value = token;

    const { setLocatieToken, removeLocatieToken } = useToken();

    if (token) {
      setLocatieToken(token);
    } else {
      removeLocatieToken();
    }
  }
  function setProfiel(payload: Profiel) {
    profiel.value = payload;
  }
  function setSelectie(persoonId: string | null) {
    selectie.value = persoonId;
  }
  async function fetchProfiel() {
    const profiel = await fetchAuthorized<Profiel>({
      url: "/api/v3/profiel",
      method: "GET",
    });

    setProfiel(profiel);
  }

  return {
    selectie,
    profiel,
    rechten,
    token,
    tokenData,
    locatieToken,
    setToken,
    setLocatieToken,
    setSelectie,
    fetchProfiel,
  };
});

