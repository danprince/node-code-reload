import assert from "assert";
import { callWithSharedWorker, closeSharedWorker, resetSharedWorker } from "./shared-worker.mjs";

// This approach uses a single worker instance, rather than creating a new one
// for each import. That means that the runtime's module cache is still shared
// across calls to `callWithSharedWorker` but we also have `resetSharedWorker`
// which replaces the current worker with a new instance.
//
// The use case for this approach is more niche, but for build processes that
// re-run after detecting changes on disk, there is no need to evaluate a
// module from disk multiple times during a single build. Instead, reset the
// worker once after each build.

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
