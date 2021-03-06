const assert = require('assert');

module.exports = {
  'getLog() test with ES6 async/await': async (client) => {
    client.url('http://localhost');

    const logResult = await client.getLog();
    assert.strictEqual(Array.isArray(logResult.value), true);
    assert.strictEqual(logResult.value.length, 2);

    const logResultCallback = await client.getLog('browser', function(result) {
      return result;
    });
    assert.strictEqual(Array.isArray(logResultCallback.value), true);
    assert.strictEqual(logResultCallback.value.length, 2);

    let interval = new Date().getTime();
    const logResultBrowser = await client.getLog(function(result) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          interval = new Date().getTime() - interval;
          resolve();
        }, 20);
      });
    });

    assert.strictEqual(Array.isArray(logResultBrowser.value), true);
    assert.strictEqual(logResultBrowser.value.length, 2);
    assert.strictEqual(interval >= 20, true, `Expected interval greater than 20 ms but got ${interval}`);

    await client.end();
  }
};
