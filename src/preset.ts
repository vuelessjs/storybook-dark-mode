export function managerEntries(entry: string[] = []) {
  return [...entry, import.meta.resolve('./manager')];
}
