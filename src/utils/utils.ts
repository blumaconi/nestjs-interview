export function getNextId<T extends { id: number }>(arr: T[]): number {
  const last = arr
    .map((x) => x.id)
    .sort()
    .reverse()[0];

  return last ? last + 1 : 1;
}
