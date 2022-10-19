import { defineStore } from "pinia";
import { Persoon } from "~/types/persoon";
import { fetchAuthorized } from "~/util/fetch";

export const usePersoonStore = defineStore("persoon", () => {
  // MARK: State
  const personen = ref<Record<string, Persoon>>({});

  // MARK: Getters
  const personenWeergave = computed(() =>
    Object.values<Persoon>(personen.value)
      .filter((p: Persoon) => !p.deleted)
      .sort((a, b) => a.recent - b.recent)
      .reverse()
  );

  // MARK: Actions/Mutations
  function setPersonen(personen: Record<string, Persoon>) {
    this.personen = personen;
  }
  function setPersoon(persoon: Persoon) {
    this.personen[persoon.uid] = persoon;
  }

  async function listUsers() {
    const response = await fetchAuthorized<Persoon[]>({
      url: "/api/v3/bar/personen",
      method: "POST",
    });

    const personen = Object.values(response);
    const personenRecord = Object.fromEntries(personen.map((p, i) => [p.uid, { ...p }]));

    setPersonen(personenRecord);
  }
  async function updateBijnaam({ id, name }: { id: string; name: string }) {
    await fetchAuthorized<void>({
      url: "/api/v3/bar/updatePerson",
      method: "POST",
      body: JSON.stringify({ id, name }),
    });

    setPersoon({
      ...this.personen[id],
      naam: name,
    });
  }

  return {
    listUsers,
    setPersoon,
    personen,
    personenWeergave,
  };
});

