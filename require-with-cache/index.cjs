let assert = require("assert");

{
  // The first time that a given module is required, the results of evaluating
  // it are saved into `require.cache`.
  let dependency = require("../shared/dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 1, transitive: 1 },
    "first call",
  );
}

{
  // Subsequent times that the module is required will re-use the version
  // inside `require.cache`.
  let dependency = require("../shared/dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 2, transitive: 2 },
    "second call (using cached modules)",
  );
}

{
  // But `require.cache` is an object that we can inspect and mutate to remove
  // cached modules, so future requires will re-evaluate the source on disk.
  delete require.cache[require.resolve("../shared/dependency.cjs")];
  delete require.cache[require.resolve("../shared/transitive.cjs")];
  let dependency = require("../shared/dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 1, transitive: 1 },
    "third call (after clearing cached modules)",
  );
}
