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

    /* for debug */
    toString(overrideName?: string): string;
  }
  export type Transform<A,B>=(value?: A, ...args: any[])=>B

  /*    internal stuff    */
  /* wrap them explicitly for better readability */
  namespace internal {
    export const id = 'is_monad';
    export const Prototype: any = {};
    Prototype[id] = true;
  }

  /*    monad implementation    */
  export interface UnitParam<A> {
    name?: string;
    modifier?: Modifier<A>
  }
  export type Modifier<A> =   (monad: Monad<A>, value: A)=> void;
  export function createUnit<A>(_param?: UnitParam<A>|string|Modifier<A>|{name: Modifier<A>}): Unit<A> {
    let modifier: Modifier<A>;
    let name = 'Monad';
    if (typeof _param === 'string') {
      name = _param;
    } else if (typeof _param === 'function') {
      modifier = <Modifier<A>> _param;
    } else if (typeof _param === 'object') {
      let keys = Object.keys(_param);
      let key: string = keys[0];
      if (keys.length == 1 && typeof key === 'string' && (typeof (<any>_param)[key]) === 'function') {
        name = key;
        modifier = <Modifier<A>> (<any>_param)[key];
      }
    } else if (_param !== void 0) {
      throw new TypeError('invalid param: ' + _param)
    }
    let prototype = Object.create(internal.Prototype);
    let unit = <Unit<A>> function unit(value: A) {
      let monad = <Monad<A>> Object.create(prototype);
      monad.bind = function bind<B>(transform: Transform<A,Monad<B>>, args: any[]|IArguments): Monad<B> {
        return transform(value, ...Array.prototype.slice.call(arguments));
      };
      monad.toString = function toString(overrideName: string = name): string {
        return `${overrideName}(${value})`;
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
    return typeof o === 'object' && o[internal.id] === true;
  }
}
export = functional;
