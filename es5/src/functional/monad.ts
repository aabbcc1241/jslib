/**
 * typescript implement of https://github.com/douglascrockford/monad
 * the case of is inspire by https://github.com/cbowdon/TsMonad
 * and some more type of monad and utils functions
 * */

module functional {
  /*    monad interface    */
  export interface Unit<A> {
    (value: A): Monad<A>;

    /* add method (store into prototype), return self */
    lift(name: string, func: Transform<A,any>): Unit<A>;
  }

  export interface Monad<A> {
    /* chain operation */
    bind<B>(transform: Transform<A,Monad<B>>, args: any[]|IArguments): Monad<B>;

    /* store method */
    [name: string]: Function;
  }
  export type Transform<A,B>=(value?: A, ...args: any[])=>B

  /*    internal stuff    */
  namespace internal {
    export const id = 'is_monad';
    export const Prototype: any = {};
    Prototype[id] = true;
  }

  /*    monad implementation    */
  export function createUnit<A>(modifier?: (monad: Monad<A>, value: A)=>void): Unit<A> {
    let prototype = Object.create(internal.Prototype);
    let unit = <Unit<A>> function unit(value: A) {
      let monad = <Monad<A>> Object.create(prototype);
      monad.bind = function bind<B>(transform: Transform<A,Monad<B>>, args: any[]|IArguments): Monad<B> {
        return transform(value, ...Array.prototype.slice.call(arguments));
      };
      if (typeof modifier === 'function') {
        modifier(monad, value)
      }
      return monad;
    };
    unit.lift = function lift(name: string, func: Transform<A,any>): Unit<A> {
      let monad = <Monad<A>> this;
      prototype[name] = function (...args: any[]) {
        let result = monad.bind<any>(func, arguments);
        return isMonad(result)
          ? result
          : createUnit()(result);
      };
      return unit;
    };
    return unit;
  }

  /*    public util functions    */
  export function isMonad(o: any): boolean {
    return o[internal.id] === true;
  }
}
export = functional;
