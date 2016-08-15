/**
 * typescript implement of https://github.com/douglascrockford/monad
 * and some more type of monad and utils functions
 * */

module functional {
  /*    monad interface    */
  export interface Unit<A> {
    (value: A): Monad<A>;

    /* add method (store into prototype), return self (unit) */
    method(name: string, func: Transform<A,any>): Unit<A>;

    /* add method in chain manner, return self (unit) */
    lift(name: string, func: Transform<A,A>): Unit<A>;
  }

  export interface Monad<A> {
    bind<B>(transform: Transform<A,Monad<B>>, args?: any[]): Monad<B>;

    map(transform: Transform<A,A>, args?: any[]): Monad<A>;

    /* chain operation, (do later) */
    chain<B>(transform: Transform<A,B>, args?: any[]): Chain<B>;

    /* store method */
    [name: string]: Function;

    /* for debug */
    toString(overrideName?: string): string;
  }
  export type Transform<A,B>=(value?: A, ...args: any[])=>B
  export interface Chain<A> extends Monad<A> {
    /* return chained result */
    do(): A;

    /* return self (e.g. to add more chain) */
    chain(transform: Transform<A,A>, args?: any): Chain<A>;
  }

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
  export type Modifier<A> = (monad: Monad<A>, value: A)=>void;
  export function createUnit<A>(_param?: UnitParam<A>|string|Modifier<A>|{name: Modifier<A>}): Unit<A> {
    /* process param */
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

    /* store methods */
    let prototype = Object.create(internal.Prototype);

    /* generate unit */
    let unit = <Unit<A>> function unit(value: A): Monad<A> {
      let monad = <Monad<A>> Object.create(prototype);
      monad.bind = function bind<B>(transform: Transform<A,Monad<B>>, args?: any[]): Monad<B> {
        return transform(value, ...args);
      };
      monad.map = function chain(transform: Transform<A,A>, args?: any[]): Monad<A> {
        return unit(transform(value, ...args));
      };
      monad.chain = function chain<B>(transform: Transform<A,B>, args?: any[]): Chain<B> {
        return createChain<B>(()=>transform(value, ...args));
      };
      monad.toString = function toString(overrideName: string = name): string {
        return `${overrideName}(${value})`;
      };
      if (typeof modifier === 'function') {
        modifier(monad, value);
      }
      return monad;
    };
    unit.method = function method(name: string, func: Transform<A,any>): Unit<A> {
      prototype[name] = function (...args: any[]): any {
        let monad = <Monad<A>> this;
        return monad.bind<any>(value=>func(value, ...args));
      };
      return unit;
    };
    unit.lift = function lift(name: string, func: Transform<A,A>): Unit<A> {
      prototype[name] = function (...args: any[]): Monad<A> {
        let monad = <Monad<A>> this;
        return monad.map(func, args);
      };
      return unit;
    };
    return unit;
  }

  export function createChain<A>(func: ()=>A): Chain<A> {
    let chain = <Chain<A>> {};
    chain.do = func;
    chain.map = function map<B>(transform: Transform<A,B>, args?: any[]) {
      return createChain(()=>transform(func()))
    };
    chain.chain = function (transform: Transform<A,A>, args?: any[]) {
      let last = chain.do;
      chain.do = ()=> transform(last());
      return chain;
    };
    return chain;
  }

  /*    public util functions    */
  const _unit = createUnit<any>();

  export function unit<A>(value: A): Monad<A> {
    return _unit(value)
  }

  export function wrap<T>(tOrMt: T|Monad<T>): Monad<T> {
    return <Monad<T>> (isMonad(tOrMt) ? tOrMt : _unit(tOrMt));
  }

  export function isMonad(o: any): boolean {
    return typeof o === 'object' && o[internal.id] === true;
  }
}
export = functional;
