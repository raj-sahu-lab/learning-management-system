/**
 * proxyController.js
 * A generic jest mock module for controllers that cannot be parsed by Babel
 * (e.g. contain legacy octal literals or require missing credential files).
 * Returns a Proxy so any property access yields jest.fn().
 */
module.exports = new Proxy({}, {
  get(target, prop) {
    if (!(prop in target)) {
      target[prop] = jest.fn((req, res) => res && res.status(200).json({ success: true }));
    }
    return target[prop];
  }
});
