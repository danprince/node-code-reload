let assert = require("assert");

{
  let dependency = require("./dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 1, transitive: 1 },
    "first call",
  );
}

{
  let dependency = require("./dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 2, transitive: 2 },
    "second call (using cached modules)",
  );
}

{
  delete require.cache[require.resolve("./dependency.cjs")];
  delete require.cache[require.resolve("./transitive.cjs")];
  let dependency = require("./dependency.cjs");

  assert.deepStrictEqual(
    dependency.call(),
    { dependency: 1, transitive: 1 },
    "third call (after clearing cached modules)",
  );
}
