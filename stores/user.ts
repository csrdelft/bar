import { defineStore } from "pinia";
import { Profiel } from "~/types/profiel";

export const useUserStore = defineStore("user", () => {
  // MARK: State
  const profiel = ref<Profiel | null>(null);

  // MARK: Getters
  const rechten = computed(() => ({
    admin: profiel.value?.scopes.includes("BAR:TRUST") ?? false,
    beheer: profiel.value?.scopes.includes("BAR:BEHEER") ?? false,
  }));

  // MARK: Actions/Mutations
  async function fetchProfiel() {
    const data = await fetchAuthorized<Profiel>("/api/v3/profiel", {
      method: "GET",
    });
    profiel.value = data;
  }

  return {
    profiel,
    rechten,
    fetchProfiel,
  };
});

