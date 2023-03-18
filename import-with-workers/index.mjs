import assert from "assert";
import { callWithWorker } from "./worker.mjs";

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
