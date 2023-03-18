import assert from "assert";

async function main() {
  {
    let dependency = await import("./dependency.mjs");
    assert.deepStrictEqual(
      dependency.call(),
      { dependency: 1, transitive: 1 },
      "first call",
    );
  }

  {
    let dependency = await import("./dependency.mjs");
    assert.deepStrictEqual(
      dependency.call(),
      { dependency: 2, transitive: 2 },
      "second call (using cached modules)",
    );
  }

  {
    let dependency = await import("./dependency.mjs?v=123");
    assert.deepStrictEqual(
      dependency.call(),
      { dependency: 1, transitive: 3 },
      "third call (using fresh version of dependency and cached version of transitive)",
    );
  }
}

main();
