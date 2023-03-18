import assert from "assert";
import { callWithWorker } from "./worker.mjs";

// Unlike using `import`, node's `worker_threads` module allows us to import
// a file in a separate thread, which also has a separate module cache.
//
// The downside of this approach is that it adds a layer of indirection
// between your code and the code you want to call. All communication to worker
// threads must be with serializable data. That means we can't have the worker
// load a new version of the module then send it back to the main thread.
// Instead, the worker has to interact with the fresh module to produce a value
// that can be sent back.

async function main() {
  assert.deepStrictEqual(
    await callWithWorker("../shared/dependency.mjs"),
    { dependency: 1, transitive: 1 },
    "first call (using worker)",
  );

  assert.deepStrictEqual(
    await callWithWorker("../shared/dependency.mjs"),
    { dependency: 1, transitive: 1 },
    "second call (using worker)",
  );

  await assert.rejects(
    () => callWithWorker("../shared/broken.mjs"),
    "rejects if there is an error importing the file",
  );
}

main();
