let calls = 0;

function call() {
  return calls += 1;
}

module.exports = { call };
