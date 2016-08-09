/**
 * Created by beenotung on 8/8/16.
 */

const testname = 'jslib-overall';

const LINE_LENGTH = 32;
/* H1, H2 style (being less empathized) */
const LINE = '='.repeat(LINE_LENGTH);
const LINE2 = '-'.repeat(LINE_LENGTH);
console.log(LINE);
console.log('test ' + testname + ' start');
console.log(LINE);
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
    console.log(LINE2);
    console.log('start', ':', name);
    console.log(LINE2);
    // console.log();
    console.assert(typeof func === 'function', 'testModule invalid argument, expect testModule(String, Function)');
    var module = require(name);
    var result = func(module);
    Promise.resolve(result).then(function () {
      console.log();
      console.log(LINE2);
      console.log('success', ':', name);
      console.log(LINE2);
      console.log();
      resolve();
    }).catch(function (e) {
      console.error();
      console.error(LINE2);
      console.error('fail', {name: name, error: e});
      console.error(LINE2);
      console.error();
      reject(name);
    })
  }));
}


testModule('../es5/dist/utils-es5', function (u5) {
  return new Promise(function (resolve, reject) {
    // console.log({u5:u5});
    console.assert(u5.isNumber('1'), 'isNumber is not working');
    console.assert(!u5.isNumber('a'), 'isNumber is not working');
    console.assert(u5.JsMap.constructor.name == 'Function', 'JsMap is not defined');
    var a1 = u5.UID.Next();
    var a2 = u5.UID.Next();
    console.assert(a1 != a2, 'UID is not working');
    var paramName = u5.getParamNames(testModule);
    console.log({
      functionName: testModule.name,
      paramName: paramName
    });
    console.assert(Array.isArray(paramName), 'getParamNames not working');
    resolve();
  });
});

testModule('../es6/dist/utils-es6', function (u6) {
  return new Promise(function (resolve, reject) {
    console.log({u6: u6});
    var url = 'http://127.0.0.1:8181/horizon/horizon.js';
    u6.require.load(url, void 0, eval)
      .then(function () {
        // show('Horizon');
        let hz = new Horizon({
          host: '127.0.0.1',
          authType: 'anonymous'
        });
        // console.log({hz: hz});
        console.log({connect: hz.connect.toString()});
        console.log('connecting to hz');
        hz.onReady(()=> {
          console.log('connected to hz');
          resolve()
        });
        hz.onSocketError(e=> {
          console.error('failed to connect to hz');
          reject(e)
        });
        hz.connect();
        console.warn('horizon connection is not support in nodejs?');
        resolve();
      })
      .catch(reject);
  });
});


// Promise.all.apply(Promise, testModuleList)
Promise.all(testModuleList)
  .then(function () {
    console.log();
    console.log(LINE);
    console.log('test ' + testname + ' end, all success');
    console.log(LINE);
    console.log();
  })
  .catch(function (name) {
    console.error();
    console.error(LINE);
    console.error('test ' + testname + ' end, some failed (' + name + ')');
    console.error(LINE);
    console.error();
  });

