// eslint-disable-next-line import/prefer-default-export
export const throwError = (msg: string): never => {
  throw new Error(msg);
};
