import assert from "assert";

async function main() {
  {
    // Unlike `require`, the module cache for `import` lives with the runtime
    // (e.g. v8) rather than node and that cache is inaccessible and opaque.
    // The first time we import a module, it is evaluated from the source on
    // disk, then added to that cache.
    let dependency = await import("./dependency.mjs");
    assert.deepStrictEqual(
      dependency.call(),
      { dependency: 1, transitive: 1 },
      "first call",
    );
  }

  {
    // The next time we import the module, the runtime's module cached version
    // is used, and we'd expect to see module state preserved between imports.
    let dependency = await import("./dependency.mjs");
    assert.deepStrictEqual(
      dependency.call(),
      { dependency: 2, transitive: 2 },
      "second call (using cached modules)",
    );
  }

  {
    // However, there is a trick you can use to bypass a stale module which is
    // to add a cache busting query parameter to the import url. This ensures
    // we don't get the original version of `./dependency.mjs` but the problem
    // is that it does not extend to the rest of the module graph.
    //
    // This creates a new problem which is that the old version of the module
    // isn't cleaned up and the process is effectively leaking memory with
    // each fresh import.
    //
    // In the example below, you can see that even though we loaded a fresh
    // version of `dependency.mjs`, it still imported the old cached version
    // of `./transitive.mjs`.
    let dependency = await import("./dependency.mjs?v=123");
    assert.deepStrictEqual(
      dependency.call(),
      { dependency: 1, transitive: 3 },
      "third call (using fresh version of dependency and cached version of transitive)",
    );
  }
}

main();
