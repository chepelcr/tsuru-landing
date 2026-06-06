// The ONLY import site of examples.json.
import data from "@/content/examples.json";

export type ExampleStore = (typeof data.stores)[number];

export function getExampleStores(): ExampleStore[] {
  return data.stores;
}
