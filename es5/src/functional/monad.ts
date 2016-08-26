/**
 * typescript implement of https://github.com/douglascrockford/monad
 * and some more type of monad and utils functions
 * */
import {objectCopy} from "../utils-es5";

module functional {
  /* alias */
  export type Type<A,B> = T<A,B>;
  export type Monad<A>=M<A>;
  export const create_type = def_type;
  export const t = type;
  export const m = monad;
  export const def_unit = def_monad;
  export const create_unit = def_unit;
  export const create_monad = def_monad;

  /* interfaces */
  export type Func<A,B>=(a: A, ...args: any[])=>B;
  export interface T<A,B> {
    name(): string;
    subType(): T<B,any>;
    instanceOf(name: string): boolean;
    extend<C,D>(name: string, subTypeName?: string, impls?: string[]): T<C,D>;
  }
  export interface M<A> {
    type(): T<M<A>,A>;

    /* to identify monad */
    is_monad(): boolean;

    /* alias bind, flatmap, chain */
    bind    <B>(func: Func<A,M<B>>, ...args: any[]): M<B>;
    flatmap <B>(func: Func<A,M<B>>, ...args: any[]): M<B>;
    chain   <B>(func: Func<A,M<B>>, ...args: any[]): M<B>;

    map<B>(func: Func<A,B>, ...args: any[]): M<B>;

    /* alias unflat, constructor, unit */
    unflat      (): MM;
    constructor (): MM;
    unit        (): MM;

    /* custom methods */
    [name: string]: Function;
  }
  export interface MM {
    type(): T<MM,M<any>>;

    /* alias unitOf, pure, instance, flat */
    <A>(a: A, subType?: string): M<A>;
    unitOf    <A>(a: A, subType?: string): M<A>;
    pure      <A>(a: A, subType?: string): M<A>;
    instance  <A>(a: A, subType?: string): M<A>;
    flat      <A>(a: A, subType?: string): M<A>;

    /* return this */
    method<B>(name: string, func: Func<any,B>): MM;
    /* return this */
    lift<B>(name: string, func: Func<any,M<B>|B>): MM;
  }

  module internal {
    export const monad_plugin_list: Func<M<any>,void>[] = [];
    export const type_list: {[name: string]: {[subTypeName: string]: T<any,any>}} = {};
    export const monad_maker_list: {[name: string]: MM} = {};
    export const Monad_Prototype = <M<any>>{};
    /* set monad id */
    Monad_Prototype.is_monad = ()=>true;
    /* set alias */
    Monad_Prototype.flatmap = <any>function () {
      return this.chain(arguments)
    };
    Monad_Prototype.chain = <any>function () {
      return this.bind(arguments)
    };
    Monad_Prototype.constructor = function () {
      return this.unflat(arguments)
    };
    Monad_Prototype.unit = function () {
      return this.unflat(arguments)
    };
    export const Monad_Maker_Prototype = <MM>{};
    Monad_Maker_Prototype.unitOf = function () {
      return this(arguments)
    };
    Monad_Maker_Prototype.pure = function () {
      return this(arguments)
    };
    Monad_Maker_Prototype.instance = function () {
      return this(arguments)
    };
    Monad_Maker_Prototype.flat = function () {
      return this(arguments)
    };
  }

  /* functions */
  export function type<A,B>(name: string, subTypeName: string = 'void 0'): T<A,B> {
    let table = internal.type_list[name];
    if (table) {
      let res = table[subTypeName];
      if (res) {
        return res;
      } else {
        throw new Error(`type not found : ${name}<${subTypeName}>`);
      }
    } else {
      throw new Error('type not found : ' + name);
    }
  }

  export function monad(name: string): MM {
    let res = internal.monad_maker_list[name];
    if (res)
      return res;
    else
      throw new Error(`monad <${name}> not found`);
  }

  export function def_or_get_type<A,B>(name: string, subTypeName: string = 'void 0', impls: string[] = []): T<A,B> {
    try {
      return def_type(name, subTypeName, impls);
    } catch (e) {
      return type(name, subTypeName);
    }
  }

  export function def_type<A,B>(name: string, subTypeName: string = 'void 0', impls: string[] = []): T<A,B> {
    if (internal.type_list[name] && internal.type_list[name][subTypeName])
      throw new Error(`type <${name}> is already defined`);

    let res = <T<A,B>>{};

    /* override default methods */
    res.toString = ()=>`type(${name}<${subTypeName}>)`;

    /* self impl */
    res.name = ()=>name;
    res.subType = ()=>type(subTypeName);
    res.instanceOf = target=>
    name == target
    || impls.indexOf(target) != -1
    || impls.map(typename=>type(typename))
      .some((parent: T<any,any>)=>parent.instanceOf(name));
    res.extend = <C,D>(res_name: string, res_subType: string = 'void 0', res_impls: string[] = [])=> {
      res_impls.push(name);
      return def_type<C,D>(res_name, res_subType, res_impls);
    };

    /* registry type */
    if (!internal.type_list[name])
      internal.type_list[name] = {};
    internal.type_list[name][subTypeName] = res;

    return res;
  }

  export function def_monad(name: string, modifier?: (monad: M<any>, value: any)=>void): MM {
    let monadMaker = <MM>{};
    let prototype = Object.create(internal.Monad_Prototype);

    /* override default methods */
    monadMaker.toString = ()=>`monad_maker(${name})`;

    /* type impl */
    let type = def_type<MM,any>(name + '_maker');
    monadMaker.type = ()=>type;


    /* self impl */
    function unit<A>(value: A, subType: string = 'void 0'): M<A> {
      let monad = <M<A>>Object.create(prototype);

      /* override default methods */
      monad.toString = ()=>`${name}(${value})`;

      /* type impl */
      // subtype may be reused, so the type might already exist
      let type = def_or_get_type(name, subType, ['monad']);
      monad.type = ()=>type;

      /* self impl */
      monad.bind = function bind<B>(func: Func<A,M<B>>, ...args: any[]): M<B> {
        return func(value, ...args);
      };

      monad.map = function map<B>(func: Func<A,B>, ...args: any[]): M<B> {
        let f = <Func<A,M<B>>><any><Func<A,B>>func;
        let b = <B><any><M<B>> monad.bind(f, ...args);
        return monadMaker(b);
      };

      monad.unflat = function unflat(): MM {
        return monadMaker;
      };

      if (typeof modifier === 'function')
        modifier(monad, value);

      return monad;
    }

    monadMaker = <MM>unit;
    objectCopy(internal.Monad_Maker_Prototype, monadMaker);

    monadMaker.method = function method<B>(name: string, func: Func<any,B>): MM {
      let f = <Func<any,M<B>>><any><Func<any,B>>func;
      prototype[name] = function (...args: any[]) {
        let monad = <M<any>>this;
        return monad.bind(value=>f(value, ...args))
      };
      return monadMaker;
    };

    monadMaker.lift = function lift<B>(name: string, func: Func<any,M<B>|B>): MM {
      prototype[name] = function (...args: any[]) {
        let monad = <M<any>>this;
        return monad.bind(wrapFunc<any,B>(func, monadMaker), ...args)
      };
      return monadMaker;
    };

    /* registry monadMaker */
    if (name in internal.monad_maker_list)
      console.warn(`monad <${name}> is already defined, overwriting existing definition`);
    internal.monad_maker_list[name] = monadMaker;

    return monadMaker;
  }

  export function is_monad(o: any): boolean {
    return typeof o === 'object'
      && typeof o.is_monad === 'function'
      && o.is_monad() === true;
  }

  /* configs */
  export module types {
    export const type = def_type<T<any,any>,void>('type');
    export const any = def_type<any,void>('any');
    export const void0 = def_type<void,void>('void 0');
  }

  /* utils */
  export const unit = def_monad('monad');

  export function wrapFunc<A,B>(func: Func<A,M<B>|B>, mm: MM): Func<A,M<B>> {
    return function (): M<B> {
      let res = (<Function>func).apply(null, arguments);
      return is_monad(res)
        ? res
        : mm(res);
    };
  }
}
export = functional;
