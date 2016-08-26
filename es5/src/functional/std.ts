/**
 * the standard monads
 * */

import {M, MM, def_monad, types, def_type, unit, Func, type} from "./monad";
import {isDefined} from"../utils-es5";
module functional {

  /* interfaces */
  export type Gen<A>=()=>A;
  export interface Maybe<A> extends M<A> {
    isSome(): boolean;
    isNone(): boolean;
    caseOf<B>(branch: Maybe.ICaseOf<A,B>): Maybe<B>;
  }
  export namespace Maybe {
    export type ICaseOf<A,B>={
      some: (value: A)=>B,
      none: ()=>B
    }
  }
  export interface IO<A extends Gen<A>>extends M<A> {
    do(): A;
  }

  module internal {

  }

  /* impls */
  export const maybe = def_monad('maybe', (monad: Maybe<any>, value: any)=> {
    if (!isDefined(value)) {
      monad.bind = ()=>monad;
      monad.map = monad.bind;
    }
    monad.isSome = ()=>isDefined(value);
    monad.isNone = ()=>!isDefined(value);
    monad.caseOf = <B>(branch: Maybe.ICaseOf<any,B>)=>isDefined(value)
      ? branch.some(value)
      : branch.none();
  });
  export const io = def_monad('io', (monad: IO<any>, value: Gen<any>)=> {
  }).method('do', f=>f());

  /* functions */
  export function do_<A extends Gen<A>>(io: IO<A>): M<A> {
    //TODO turn into promise?
    return unit<A>(io.do());
  }
}
export = functional;
