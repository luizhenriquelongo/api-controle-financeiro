// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export const parseDate = (date: string): Date => {
  const splittedDate = date.split('/');

  return new Date(
    Number(splittedDate[2]),
    Number(splittedDate[1] - 1),
    Number(splittedDate[0])
  );
};
