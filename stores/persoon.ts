import { defineStore } from "pinia";
import { Persoon } from "~/types/persoon";
import { fetchAuthorized } from "~/composables/fetch";

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
  function setPersonen(data: Record<string, Persoon>) {
    personen.value = data;
  }
  function setPersoon(persoon: Persoon) {
    personen.value[persoon.uid] = persoon;
  }

  async function listUsers() {
    const response = await fetchAuthorized<Persoon[]>("/api/v3/bar/personen");

    const personen = Object.values(response);
    const personenRecord = Object.fromEntries(personen.map((p, i) => [p.uid, { ...p }]));

    setPersonen(personenRecord);
  }
  async function updateBijnaam({ id, name }: { id: string; name: string }) {
    await fetchAuthorized<void>("/api/v3/bar/updatePerson", {
      body: JSON.stringify({ id, name }),
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

