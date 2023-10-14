export const sum = (...args: number[]): number => args.reduce((a, b) => a + b, 0);
export const groupBy = <T>(elements: T[], key: keyof T) =>
  Object.fromEntries(elements.map((el) => [el[key], el]));
