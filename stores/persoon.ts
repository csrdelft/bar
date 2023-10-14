import { defineStore } from "pinia";
import { Persoon } from "~/types/persoon";
import { fetchAuthorized } from "~/server/utils/fetch";

export const usePersoonStore = defineStore("persoon", () => {
  // MARK: State
  const personen = ref<Record<string, Persoon>>({});
  const persoonSelectie = ref<string | null>(null);

  // MARK: Getters
  const personenWeergave = computed(() =>
    Object.values<Persoon>(personen.value)
      .filter((p: Persoon) => !p.deleted)
      .sort((a, b) => a.recent - b.recent)
      .reverse()
  );
  const huidigePersoon = computed<Persoon | null>(() => {
    return persoonSelectie.value ? personen.value[persoonSelectie.value] : null;
  });

  // MARK: Actions/Mutations
  function setPersoonSelectie(id: string | null) {
    persoonSelectie.value = id;
  }
  function setPersoon(persoon: Persoon) {
    personen.value[persoon.uid] = persoon;
  }

  async function listUsers() {
    const data = await $fetch("/api/personen");

    const persoonIds = data.map((persoon) => persoon.uid);
    const persoonEntities = data.reduce((entities: Record<string, Persoon>, persoon) => {
      return { ...entities, [persoon.uid]: persoon };
    }, {});

    personen.value = persoonEntities;
  }
  async function updateBijnaam({ id, name }: { id: string; name: string }) {
    await $fetch("/api/persoon", {
      method: "PATCH",
    });

    setPersoon({
      ...personen.value[id],
      naam: name,
    });
    return;
  }

  return {
    personen,
    persoonSelectie,
    personenWeergave,
    huidigePersoon,
    setPersoonSelectie,
    setPersoon,
    listUsers,
    updateBijnaam,
  };
});
