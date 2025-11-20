import { fileURLToPath } from "url";

function managerEntries(entry = []) {
  return [...entry, fileURLToPath(import.meta.resolve("./dist/manager"))];
}

export { managerEntries };
