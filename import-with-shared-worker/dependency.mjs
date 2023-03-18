import * as transitive from "./transitive.mjs";

let calls = 0;

export function call() {
  return {
    dependency: calls += 1,
    transitive: transitive.call(),
  };
}
