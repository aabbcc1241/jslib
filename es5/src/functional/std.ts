/**
 * the standard monads
 * */

import {Monad, createUnit, Unit} from "./monad";
import {isDefined} from"../utils-es5";

module functional {
  /*    interfaces    */
  export interface Id <A> extends Monad<A> {
  }
  export interface Maybe<A>extends Monad<A> {
  }

  /*    implements    */
  export const id = createUnit();
  export const maybe = createUnit({
    'Maybe': (monad: Monad<Maybe<any>>, value: any)=> {
      if (isDefined(value)) {
        monad.toString = ()=>`Some(${value})`;
      } else {
        monad.bind = ()=>monad;
        monad.toString = ()=>'None()';
      }
    }
  });

  /*    utils functions    */
  export function none(): Maybe<any> {
    return maybe(void 0)
  }

  /*  export const Id = createUnit();
   export const Maybe = createUnit();

   export interface Maybe<A> extends Monad<A> {
   }
   export const Maybe = createUnit();

   export function maybe<A>(value?: A): Maybe<A> {
   return Maybe
   }

   export function some<A>(value?: A): Maybe<A> {
   return Maybe(value);
   }

   export function none(): Maybe<any> {
   return Maybe(void 0);
   }*/
}
export = functional;
