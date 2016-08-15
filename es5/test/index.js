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

function assert(name, result) {
  console.assert(result, 'failed test: ' + name);
  console.log('passed test: ' + name);
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

testModule('../dist/functional/monad', function (functional) {
  console.dir({module: functional});
  assert('isMonad negative', functional.isMonad({}) == false);
  let monad = functional.createUnit()('test');
  assert('isMonad position', functional.isMonad(monad));
  let result = monad.bind(x=> {
    console.log('i get the value:', x);
    return functional.createUnit()(true);
  });
  console.log('is value printed? ' + result);
  let print = (_, x)=> {
    console.log(`print ${x}`);
    return functional.createUnit()(`printed ${x}`);
  };
  monad.bind(print, 'f').bind(print, 'g');
  let calc = functional.unit(2)
      .bind(x=>functional.unit(x + 3))
      .bind(x=>functional.unit(x * 3))
    ;
  calc.bind(x=>functional.unit(
    assert('monad order ' + calc, x == ((2 + 3) * 3))
  ));
  let calc2 = functional.unit(2)
      .bind(x=>x + 3)
      .bind(x=>x * 3)
    ;
  calc2.bind(x=>assert(`monad order 2 ${calc2}`, x == 15));
});

testModule('../dist/functional/std', function (functional) {
  let some = functional.maybe('test');
  let none = functional.none();
  console.log(some.toString());
  console.log(none.toString());
  console.log('----');
  none.bind(x=> {
    console.log('so sad');
    assert('none', false)
  });
  some.bind(x=>console.log('last line should be ----'));
  console.log('there should be exactly one line under ----');
  Object.keys(' '.repeat(4)).forEach(()=> {
    let maybe = functional.maybe(Math.random() > 0.5 ? 'dice' : void 0);
    maybe.caseOf({
      'some': x=>console.log({result: x}),
      'none': ()=>console.log('no result')
    });
  });
});

console.log('test jslib-es5 end');
