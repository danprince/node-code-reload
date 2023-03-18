import assert from "assert";
import { callWithSharedWorker, closeSharedWorker, resetSharedWorker } from "./shared-worker.mjs";

async function main() {
  assert.deepStrictEqual(
    await callWithSharedWorker("../shared/dependency.mjs"),
    { dependency: 1, transitive: 1 },
    "first call (using shared worker)",
  );

  assert.deepStrictEqual(
    await callWithSharedWorker("../shared/dependency.mjs"),
    { dependency: 2, transitive: 2 },
    "second call (using shared worker)",
  );

  resetSharedWorker();
  assert.deepStrictEqual(
    await callWithSharedWorker("../shared/dependency.mjs"),
    { dependency: 1, transitive: 1 },
    "third call (after resetting shared worker)",
  );

  {
    resetSharedWorker();

    await assert.rejects(
      () => callWithSharedWorker("../shared/broken.mjs"),
      "rejects if there is an error importing the file",
    );

    await assert.doesNotReject(
      () => callWithSharedWorker("../shared/dependency.mjs"),
      "recovers after importing a busted file",
    );
  }

  closeSharedWorker();
}

main();
