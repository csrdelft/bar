import { Persoon } from "../types/persoon";

export const isOudlid = (persoon: Persoon): boolean =>
  persoon.status !== "S_LID" && persoon.status !== "S_GASTLID" && persoon.status !== "S_NOVIET";

export class SaldoError extends Error {}

