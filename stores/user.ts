import { defineStore } from "pinia";
import { Profiel } from "~/types/profiel";
import { LocatieToken } from "~/types/token";

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
  function setLocatieToken(token: LocatieToken | null) {
    locatieToken.value = token;
    const { setLocatieToken, removeLocatieToken } = useToken();
    if (token) {
      setLocatieToken(token);
    } else {
      removeLocatieToken();
    }
  }
  function setSelectie(persoonId: string | null) {
    selectie.value = persoonId;
  }
  async function fetchProfiel() {
    const data = await fetchAuthorized<Profiel>("/api/v3/profiel", {
      method: "GET",
    });
    profiel.value = data;
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

