import assert from "assert";
import { callWithSharedWorker, resetSharedWorker } from "./shared-worker.mjs";

async function main() {
  assert.deepStrictEqual(
    await callWithSharedWorker("./dependency.mjs"),
    { dependency: 1, transitive: 1 },
    "first call (using shared worker)",
  );

  assert.deepStrictEqual(
    await callWithSharedWorker("./dependency.mjs"),
    { dependency: 2, transitive: 2 },
    "second call (using shared worker)",
  );

  resetSharedWorker();
  assert.deepStrictEqual(
    await callWithSharedWorker("./dependency.mjs"),
    { dependency: 1, transitive: 1 },
    "third call (after resetting shared worker)",
  );

  {
    resetSharedWorker();

    await assert.rejects(
      () => callWithSharedWorker("./broken.mjs"),
      "rejects if there is an error importing the file",
    );

    await assert.doesNotReject(
      () => callWithSharedWorker("./dependency.mjs"),
      "recovers after importing a busted file",
    );
  }

  // The worker thread is still running and we should probably ask it to close
  // politely so that Node will automatically exit, but adding that code will
  // add noise to the shared-worker.mjs module.
  process.exit(0);
}

main();
