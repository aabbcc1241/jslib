/**
 * Created by beenotung on 8/7/16.
 */

const testname = 'jslib-es5';

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


testModule('../dist/utils-es5', u5=> {
  assert('JsMap (define)', typeof u5.JsMap === 'function');
  let map = new u5.JsMap();
  map.set('test', true);
  assert('JsMap get/set (positive)', map.get('test') === true);
  assert('JsMap get/set (negative)', map.get('text') === void 0);
});

testModule('../dist/polyfill', polyfill=> {
  assert('Array polyfill', typeof Array.prototype.clear === 'function');
  let arr = [];
  arr.pushIfNotExist(1);
  arr.pushIfNotExist(2);
  arr.pushIfNotExist(1);
  assert('Array.prototype.pushIfNotExist', arr.length == 2);
  arr.clear();
  assert('Array.prototype.clear', arr.length == 0);
});

testModule('../dist/functional/monad', MONAD=> {
  // console.dir({MONAD: MONAD});
  assert('isMonad (negative)', MONAD.is_monad({}) === false);
  let monad = MONAD.unit('test value');
  assert('isMonad (positive)', MONAD.is_monad(monad));
  let bind_test = false;
  let result = monad.map(x=> {
    bind_test = x == 'test value';
    return 'new value';
  });
  assert('bind test', bind_test);
  result.bind(x=>assert('bind result', x == 'new value'));

  let number = MONAD.def_type('number', null);
  assert('def_type', number);

  /* custom math monad test */
  let math = MONAD.create_unit('math', number)
      .lift('plus', (a, b)=> a + b)
      .lift('sub', (a, b)=>a - b)
      .lift('times', (a, b)=>a * b)
      .lift('div', (a, b)=>a / b)
      .lift('mod', (a, b)=>a % b)
      .method('valueOf', (a)=>a)
    ;
  let calc = math(2);
  // console.log({calc: calc.toString()});
  let res = calc
      .plus(2)
      .times(3)
    ;
  // console.log({res: res.toString()});
  res.map(x=>assert('custom lift', x == 12))
});

testModule('../dist/functional/std', STD=> {
  let a = STD.maybe('a');
  let aa = a.map(x=>x.repeat(10));

  let b = STD.maybe(null);
  let bb = b.map(x=>x.repeat(10));

  assert('maybe (positive)', aa.isSome());
  assert('maybe (negative)', bb.isNone());

  let as = false;
  a.caseOf({
    some: x=> {
      console.log({a: 'some'});
      as = true;
    },
    none: ()=>console.log({a: 'none'})
  });
  let bs = false;
  b.caseOf({
    some: x=>console.log({b: 'some'}),
    none: ()=> {
      console.log({b: 'none'});
      bs = true;
    }
  });
  assert('maybe.caseOf (some)', as);
  assert('maybe.caseOf (none)', bs);
});

// show('global');
// show('this');

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

