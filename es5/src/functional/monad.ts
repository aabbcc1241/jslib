/**
 * typescript implement of https://github.com/douglascrockford/monad
 * and some more type of monad and utils functions
 * */

module functional {
  /* alias */
  export type Type<A> = T<A>;
  export type Monad<A>=M<A>;
  export const create_type = def_type;
  export const t = type;
  export const def_unit = def_monad;
  export const create_unit = def_unit;
  export const create_monad = def_monad;

  /* interfaces */
  export type Func<A,B>=(a: A, ...args: any[])=>B;
  export interface T<A> {
    name(): string;
    instanceOf(name: string): boolean;
  }
  export interface M<A> {
    map<B>(func: Func<A,B>): M<B>;

    /* alias bind, flatmap, chain */
    bind    <B>(func: Func<A,M<B>>): M<B>;
    flatmap <B>(func: Func<A,M<B>>): M<B>;
    chain   <B>(func: Func<A,M<B>>): M<B>;

    /* alias unflat, constructor, unit */
    unflat      (): MM<A>;
    constructor (): MM<A>;
    unit        (): MM<A>;
  }
  export interface MM<A> {
    /* alias unitOf, pure, instance, flat */
    (a: A): M<A>;
    unitOf    (a: A): M<A>;
    pure      (a: A): M<A>;
    instance  (a: A): M<A>;
    flat      (a: A): M<A>;

    /* return this */
    method(name: string, func: Func<A,any>): MM<A>;
    /* return this */
    lift(name: string, func: Func<A,M<any>>): MM<A>;
  }

  module internal {
    export const monad_plugin_list: Func<M<any>,void>[] = [];
    export const type_list: {[name: string]: T<any>} = {};
    export const Prototype = {
      is_monad: true
    }
  }

  /* functions */
  export function def_type<A>(name: string, impls: string[] = []): T<A> {
    let res = <T<A>>{};
    res.name = ()=>name;
    res.instanceOf = x=>name == x || impls.indexOf(x) != -1;
    internal.type_list[name] = res;
    return res;
  }

  export function type<A>(name: string): T<A> {
    let res = internal.type_list[name];
    if (res)
      return res;
    else
      throw new Error(`type ${name} not found`);
  }

  export function def_monad<A>(): MM<A> {
    let monadMaker = <MM<A>>{};
    let prototype = Object.create(internal.Prototype);

    function unit(value: A): M<A> {
      let monad = <M<A>>Object.create(prototype);

      monad.map = function map<B>(func: Func<A,B>): M<B> {
        let mm = <MM<B>><any><MM<A>>monadMaker;
        return mm(func(value));
      };

      monad.bind
        = monad.flatmap
        = monad.chain
        = function bind<B>(func: Func<A,M<B>>): M<B> {
        return func(value);
      };

      monad.unflat
        = monad.constructor
        = monad.unit
        = function unflat(): MM<A> {
        return monadMaker;
      };

      return monad;
    }

    monadMaker = <MM<A>>unit;
    monadMaker.unitOf
      = monadMaker.pure
      = monadMaker.instance
      = monadMaker.flat
      = unit;

    monadMaker.method = function method(name: string, func: Func<A,any>): MM<A> {
      let monad = <M<A>>this;
      prototype[name] = (...args: any[])=>monad.bind(value=>func(value, ...args));
      return monadMaker;
    };

    monadMaker.lift = function lift(name: string, func: Func<A,M<any>>): MM<A> {
      let monad = <M<A>>this;
      prototype[name] = (...args: any[])=>monad.bind(value=>func(value, ...args));
      return monadMaker;
    };

    return monadMaker;
  }

}
module functional_old {
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
