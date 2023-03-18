let assert = require("assert");

{
  let dependency = require("../shared/dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 1, transitive: 1 },
    "first call",
  );
}

{
  let dependency = require("../shared/dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 2, transitive: 2 },
    "second call (using cached modules)",
  );
}

{
  delete require.cache[require.resolve("../shared/dependency.cjs")];
  delete require.cache[require.resolve("../shared/transitive.cjs")];
  let dependency = require("../shared/dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 1, transitive: 1 },
    "third call (after clearing cached modules)",
  );
}
