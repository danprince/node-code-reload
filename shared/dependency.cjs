let transitive = require("./transitive.cjs");
let calls = 0;

function call() {
  return {
    dependency: calls += 1,
    transitive: transitive.call(),
  };
}

module.exports = { call };
