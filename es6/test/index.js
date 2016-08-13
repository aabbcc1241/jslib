/**
 * Created by beenotung on 8/7/16.
 */

const testname = 'jslib-es6';

console.log('test ' + testname + ' start');
console.log();

function show(x) {
  var msg = {};
  if (eval('typeof ' + x) === 'undefined')
    msg[x] = undefined;
  else
    msg[x] = eval(x);
  console.log(msg);
}
var testModuleList = [];
function testModule(name, func) {
  testModuleList.push(new Promise(function (resolve, reject) {
    console.log();
    console.log('start', ':', name);
    console.assert(typeof func === 'function', 'testModule invalid argument, expect testModule(String, Function)');
    try {
      var module = require(name);
      var result = func(module);
      Promise.resolve(result).then(function () {
        console.log('success', ':', name);
        resolve();
      }).catch(function (e) {
        console.error('fail', ':', name);
        console.error(e);
        reject(name);
      })
    } catch (e) {
      console.error('fail', ':', name);
      console.error(e);
      reject(name);
    }
    console.log();
  }));
}


show('Horizon');
testModule('../dist/es6/src/utils-es6', function (u6) {
  return new Promise(function (resolve, reject) {
    var a = {a: 1};
    var b = u6.objectClone(a);
    console.assert(a.toString() == b.toString(), 'objectClone not working');
    console.assert(typeof u6.require === "object", 'jslib.require does not exist?');
    // var url = 'https://clients5.google.com/pagead/drt/dn/dn.js';
    var url = 'http://127.0.0.1:8181/horizon/horizon.js';
    // var url = 'http://yourjavascript.com/8181617142/test.js'; //pure js
    // var url = 'http://yourjavascript.com/1287911263/test.js'; //module js
    u6.require.load(url, void 0, eval)
      .then(function () {
        console.log('loaded js file');
        try {
          // console.assert(typeof test === 'function', 'test function inside the required js file is not loading successful?');
          // console.log('test function', test.toString());
          show('Horizon');
          resolve();
        } catch (e) {
          console.error('falied to handle load result', e);
          reject(e)
        }
      })
      .catch(function (error) {
        console.error('load failed', ':', error);
        reject(error);
      });
    console.log('creating an defer');
    var defer = u6.defer();
    defer.promise.then(x=>console.log({deferValue: {x}}));
    defer.resolve('this is defered value');
    Promise.resolve(defer.promise).then(x=>console.log({d1: x}));
    Promise.resolve(defer.promise).then(x=>console.log({d2: x}));
  });
});

Promise.resolve.apply(Promise, testModuleList)
  .then(function () {
    console.log();
    console.log('test ' + testname + ' end, all success');
  })
  .catch(function (name) {
    console.log();
    console.log(`test ${testname} end, some failed (${name})`);
    process.exit(1);
  });

