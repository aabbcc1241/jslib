/**
 * the standard monads
 * */

import {M, MM, def_monad, types, def_type, unit} from "./monad";
import {isDefined} from"../utils-es5";
module functional {

  /* interfaces */
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

  module internal {
    /* config */
    {
      let maybe = types.monad.extend('maybe', types.any);
      // let some = maybe.extend('some');
      // let none = maybe.extend('none');
    }
    /* impls */
    export const maybe = def_monad('maybe', types.any, (monad: Maybe<any>, value: any)=> {
      if (!isDefined(value)) {
        monad.bind = ()=>monad;
        monad.map = monad.bind;
      }
      monad.isSome = ()=>isDefined(value);
      monad.isNone = ()=>!isDefined(value);
      monad.caseOf = <B>(branch: Maybe.ICaseOf<any,B>)=>isDefined(value)
        ? branch.some(value)
        : branch.none();
    })
  }

  /* functions */
  export function maybe<A>(a: A): Maybe<A> {
    return <Maybe<A>><any><Maybe<any>>internal.maybe(a);
  }
}
export = functional;
