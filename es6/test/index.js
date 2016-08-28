/**
 * Created by beenotung on 8/7/16.
 */

const testname = 'jslib-es6';

console.log('test ' + testname + ' start');
console.log();

function show(x, scopedEval = eval) {
  var msg = {};
  if (scopedEval('typeof ' + x) === 'undefined')
    msg[x] = undefined;
  else
    msg[x] = scopedEval(x);
  console.log(msg);
}
function assert(name, result) {
  console.assert(result, 'failed test: ' + name);
  console.log('passed test: ' + name);
}
let testModuleList = [];
let failed = [];
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
      failed.push(name);
      reject(name);
    }
    console.log();
  }));
}

testModule('../dist/es6/src/utils-es6', function (jslib) {
  let defer = jslib.defer();
  try {
    let a = {a: 1};
    let b = jslib.objectClone(a);
    assert('objectClone', a.toString() == b.toString());

    let later = jslib.defer();
    let run_count = 0;
    const value = 'defered value';
    later.promise.then(x=> {
      assert('defer (run count)', run_count == 0);
      assert('defer (value)', x == value);
      run_count++;
    });
    later.resolve(value);
    Promise.resolve(later.promise).then(x=>assert('defer (first resolve value)', x == value));
    Promise.resolve(later.promise).then(x=>assert('defer (second resolve value)', x == value));

    // var url = 'https://clients5.google.com/pagead/drt/dn/dn.js';
    // var url = 'http://127.0.0.1:8181/horizon/horizon.js';
    var url = 'http://yourjavascript.com/8181617142/test.js'; //pure js
    // var url = 'http://yourjavascript.com/1287911263/test.js'; //module js
    let url_defer = jslib.defer();
    jslib.require.load(url, void 0, eval)
      .then(()=> {
        assert('JsRequire (load)', true);
        /* the loaded js file should define a function named test */
        assert('JsRequire (effect)', typeof test === 'function');
        url_defer.resolve();
      })
      .catch((e)=> {
        assert('JsRequire', false);
        url_defer.reject(e);
      });

    /* async lazy */
    let async_lazy_defer = jslib.defer();
    let hard_run_count = 0;
    let hard_val = 'this value is very hard to get';

    function hardFunc() {
      hard_run_count++;
      let defer = jslib.defer();
      setTimeout(()=> {
        defer.resolve(hard_val);
      }, 100);
      return defer.promise;
    }

    let hard = new jslib.AsyncLazy(hardFunc);
    hard.get().then(x=> {
      assert('AsyncLazy (1st get)', x == hard_val);
    }).catch(async_lazy_defer.reject);
    hard.get().then(x=> {
      assert('AsyncLazy (2nd get)', x == hard_val);
      assert('AsyncLazy (run count)', hard_run_count == 1);
      async_lazy_defer.resolve();
    }).catch(async_lazy_defer.reject);

    /* lazy */
    let lazy_val = 'lazy result';
    let lazy_run_count = 0;
    let lazy = new jslib.Lazy(()=> {
      lazy_run_count++;
      return lazy_val;
    });
    assert('lazy (1st get)', lazy.get() == lazy_val);
    assert('lazy (2nd get)', lazy.get() == lazy_val);
    assert('lazy (run count)', lazy_run_count == 1);

    Promise.all([
      url_defer.promise
      , async_lazy_defer.promise
    ])
      .then(defer.resolve)
      .catch(defer.reject);
  } catch (e) {
    defer.reject(e);
  }
  return defer.promise;
});

Promise.resolve.apply(Promise, testModuleList)
  .then(function () {
    console.log();
    if (failed.length == 0) {
      console.log('test ' + testname + ' end, all success');
    } else {
      console.log(`test ${testname} end, some failed (${failed})`);
      process.exit(1);
    }
  })
  .catch(function (name) {
    console.log();
    console.log(`test ${testname} end, some failed (${name})`);
    process.exit(1);
  });

