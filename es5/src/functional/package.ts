/**
 * typescript implement of https://github.com/douglascrockford/monad
 * the case of is inspire by https://github.com/cbowdon/TsMonad
 * and some more type of monad and utils functions
 * */

module monad {
  export interface Method {

  }
  export interface Monad<A> {
    is_monad?: boolean;
    [name: string]: Method;
  }
  export interface Unit<A> {
    (value: A): Monad<A>;
    method: Function;
    lift_value: Function;
    lift: Function;
  }
  export function monad<A>(modifier: Function): Unit<A> {
    let prototype = <Monad<A>>{
      is_monad: true
    };

    let unit = <Unit<A>> function (value: A) {
      let monad = Object.create(prototype);
      monad.bind = function (func: Function, args: Array<any>) {
        return func.apply(undefined, [value].concat(...args));
      };
      if (typeof modifier === 'function') {
        value = modifier(monad, value)
      }
      return monad;
    };

    unit.method = function (name: string, func: Method) {
      prototype[name] = func;
      return unit;
    };

    unit.lift_value = function (name: string, func: Function) {
      prototype[name] = function () {
        return this.bind(func, arguments);
      };
      return unit;
    };

    unit.lift = function (name: string, func: Function) {
      prototype[name] = function () {
        let result = this.bind(func, arguments);
        return (result && result.is_monad === true)
          ? result
          : unit(result);
      };
      return unit;
    };

    return unit;
  }
}
export = monad;
