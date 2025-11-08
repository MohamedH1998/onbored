export function parseFilter(filter?: string) {
  if (!filter) return [];

  return filter.split("|").map((filterItem) => {
    const key = filterItem.split(":")[0] as string;
    const value = filterItem.split(":")[1] as string;
    return { id: key, value: value.split(",") };
  });
}
