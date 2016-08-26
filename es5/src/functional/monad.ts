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
  export const def_unit = def_monad;
  export const create_unit = def_unit;
  export const create_monad = def_monad;

  /* interfaces */
  export type Func<A,B>=(a: A, ...args: any[])=>B;
  export interface T<A,B> {
    name(): string;
    subType(): T<B,any>;
    instanceOf(name: string): boolean;
    extend<C,D>(name: string, subType?: T<D,any>, impls?: string[]): T<C,D>;
  }
  export interface M<A> extends T<M<A>,A> {
    /* to identify monad */
    is_monad(): boolean;

    /* alias bind, flatmap, chain */
    bind    <B>(func: Func<A,M<B>>, ...args: any[]): M<B>;
    flatmap <B>(func: Func<A,M<B>>, ...args: any[]): M<B>;
    chain   <B>(func: Func<A,M<B>>, ...args: any[]): M<B>;

    map<B>(func: Func<A,B>, ...args: any[]): M<B>;

    /* alias unflat, constructor, unit */
    unflat      (): MM<A>;
    constructor (): MM<A>;
    unit        (): MM<A>;

    /* custom methods */
    [name: string]: Function;
  }
  export interface MM<A> extends T<MM<A>,M<A>> {
    /* alias unitOf, pure, instance, flat */
    (a: A): M<A>;
    unitOf    (a: A): M<A>;
    pure      (a: A): M<A>;
    instance  (a: A): M<A>;
    flat      (a: A): M<A>;

    /* return this */
    method<B>(name: string, func: Func<A,B>): MM<A>;
    /* return this */
    lift<B>(name: string, func: Func<A,M<B>|B>): MM<A>;
  }

  module internal {
    export const monad_plugin_list: Func<M<any>,void>[] = [];
    export const type_list: {[name: string]: T<any,any>} = {};
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
    export const Monad_Maker_Prototype = <MM<any>>{};
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
  export function def_type<A,B>(name: string, subType: T<B,any> = null, impls: string[] = []): T<A,B> {
    let res = <T<A,B>>{};
    /* override default methods */
    let subTypeStr = subType ? subType.name() : 'void 0';
    res.toString = ()=>`type(${name}<${subTypeStr}>))`;
    /* self impl */
    res.name = ()=>name;
    res.subType = ()=>subType;
    res.instanceOf = target =>
    name == target
    || impls.indexOf(target) != -1
    || impls.map(typename=>type(typename))
      .some((parentType: T<any,any>)=>parentType.instanceOf(name));
    res.extend = function extend<C,D>(res_name: string, res_subType: T<D,any> = subType, res_impls: string[] = []): T<C,D> {
      res_impls.push(name);
      return def_type<C,D>(res_name, res_subType, res_impls);
    };
    return res;
  }

  export function type<A,B>(name: string): T<A,B> {
    let res = internal.type_list[name];
    if (res)
      return res;
    else
      throw new Error(`type ${name} not found`);
  }

  export function def_monad<A>(name: string, subType: T<A,any>, modifier?: (monad: M<A>, value: A)=>void): MM<A> {
    let monadMaker = <MM<A>>{};
    let prototype = Object.create(internal.Monad_Prototype);

    /* override default methods */
    let subTypeStr = subType ? subType.name() : 'void 0';
    monadMaker.toString = ()=>`monad_maker(${name}<${subTypeStr}>)`;

    /* self impl */

    function unit(value: A): M<A> {
      let monad = <M<A>>Object.create(prototype);

      /* override default methods */
      monad.toString = ()=>`${name}(${value})`;

      /* type impl */
      let type = def_type(name, subType, ['monad']);
      monad.name = ()=>name;
      monad.subType = ()=>subType;

      /* self impl */
      monad.bind
        // = monad.flatmap
        // = monad.chain
        = function bind<B>(func: Func<A,M<B>>, ...args: any[]): M<B> {
        return func(value, ...args);
      };

      monad.map = function map<B>(func: Func<A,B>, ...args: any[]): M<B> {
        let mm = <MM<B>><any><MM<A>>monadMaker;
        let f = <Func<A,M<B>>><any><Func<A,B>>func;
        let b = <B><any><M<B>> monad.bind(f, ...args);
        return mm(b);
      };

      monad.unflat
        // = monad.constructor
        // = monad.unit
        = function unflat(): MM<A> {
        return monadMaker;
      };

      if (typeof modifier === 'function')
        modifier(monad, value);

      return monad;
    }

    monadMaker = <MM<A>>unit;
    objectCopy(internal.Monad_Maker_Prototype, monadMaker);

    monadMaker.method = function method<B>(name: string, func: Func<A,B>): MM<A> {
      let f = <Func<A,M<B>>><any><Func<A,B>>func;
      prototype[name] = function (...args: any[]) {
        let monad = <M<A>>this;
        return monad.bind(value=>f(value, ...args))
      };
      return monadMaker;
    };

    monadMaker.lift = function lift<B>(name: string, func: Func<A,M<B>|B>): MM<A> {
      let mm = <MM<B>><any><MM<A>>monadMaker;
      prototype[name] = function (...args: any[]) {
        let monad = <M<A>>this;
        return monad.bind(wrapFunc<A,B>(func, mm), ...args)
      };
      return monadMaker;
    };

    return monadMaker;
  }

  export function is_monad(o: any): boolean {
    return typeof o === 'object'
      && typeof o.is_monad === 'function'
      && o.is_monad() === true;
  }

  /* configs */
  export module types {
    export const type = def_type('type');
    export const any = def_type('any');
    def_type('monad_maker', any, ['type']);
    export const monad = type.extend('monad', any);
  }

  /* utils */
  export const unit = create_monad('monad', types.any);

  export function wrapFunc<A,B>(func: Func<A,M<B>|B>, mm: MM<B>): Func<A,M<B>> {
    return function (): M<B> {
      let res = (<Function>func).apply(null, arguments);
      return is_monad(res)
        ? res
        : mm(res);
    };
  }
}
export = functional;
