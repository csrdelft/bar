import { defineStore } from "pinia";
import { Persoon } from "../types/persoon";
import { fetchAuthorized } from "../util/fetch";

interface PersoonState {
  personen: Record<string, Persoon>;
}

export const usePersoonStore = defineStore("persoon", {
  state: (): PersoonState => ({
    personen: {},
  }),

  getters: {
    personenWeergave: (state: PersoonState) =>
      Object.values<Persoon>(state.personen)
        .filter((p: Persoon) => !p.deleted)
        .sort((a, b) => a.recent - b.recent)
        .reverse(),
  },

  actions: {
    setPersonen(personen: Record<string, Persoon>) {
      this.personen = personen;
    },
    setPersoon(persoon: Persoon) {
      this.personen[persoon.uid] = persoon;
    },

    async listUsers(): Promise<void> {
      const response = await fetchAuthorized<Persoon[]>({
        url: "/api/v3/bar/personen",
        method: "POST",
      });

      const personen = Object.values(response);
      const personenRecord = Object.fromEntries(personen.map((p, i) => [p.uid, { ...p }]));

      this.setPersonen(personenRecord);
    },
    async updateBijnaam({ id, name }: { id: string; name: string }): Promise<void> {
      await fetchAuthorized<void>({
        url: "/api/v3/bar/updatePerson",
        method: "POST",
        body: JSON.stringify({ id, name }),
      });

      this.setPersoon({
        ...this.personen[id],
        naam: name,
      });
    },
  },
});

