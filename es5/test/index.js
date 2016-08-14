/**
 * Created by beenotung on 8/7/16.
 */
console.log('test jslib-es5 start');

function testModule(name, func) {
  console.log();
  console.log('start', ':', name);
  try {
    var module = require(name);
    func(module);
    console.log('success', ':', name);
  } catch (e) {
    console.error('fail', ':', name);
    console.error(e);
    process.exit(1);
  }
  console.log();
}

testModule('../dist/utils-es5', function (u5) {
  console.assert(typeof u5.JsMap === "function", 'jslib.JsMap does not exist?');
});

testModule('../dist/polyfill', function (polyfill) {
  console.assert(typeof Array.prototype.clear === 'function', 'Array polyfill not working');
  var arr = [];
  arr.pushIfNotExist(1);
  arr.pushIfNotExist(2);
  arr.pushIfNotExist(1);
  console.assert(arr.length == 2, 'Array.prototype.pushIfNotExist not working');
  arr.clear();
  console.assert(arr.length == 0, 'Array.prototype.clear not working');
});

testModule('../dist/functional/monad', function (monad) {
  console.dir(monad);
});

console.log('test jslib-es5 end');
