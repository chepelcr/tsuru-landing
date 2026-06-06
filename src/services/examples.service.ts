import { getExampleStores, type ExampleStore } from "@/repositories/examples.repository";

export type { ExampleStore };

/** All example stores, ordered by `order`. */
export function listExampleStores(): ExampleStore[] {
  return [...getExampleStores()].sort((a, b) => a.order - b.order);
}
