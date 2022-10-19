export const useFormatter = () => {
  return {
    bedragFormat: (bedrag: number): string => {
      let achterKomma = String(Math.abs(bedrag % 100));
      if (achterKomma === "0") {
        achterKomma = "00";
      } else if (Number(achterKomma) < 10) {
        achterKomma = `0${achterKomma}`;
      }

      if (bedrag > -100 && bedrag < 0) return `€-0,${achterKomma}`;

      const string = `€${(bedrag - (bedrag % 100)) / 100},${achterKomma}`;

      return string.replace("€-", "-€");
    },
    datumFormat: (datum: Date): string => {
      return datum.toLocaleDateString("nl-NL");
    },
  };
};

