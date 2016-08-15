/**
 * the standard monads
 * */

import {Monad, createUnit, Unit, isMonad, unit} from "./monad";
import {isDefined} from"../utils-es5";

module functional {
  /*    interfaces    */
  export interface Maybe<A>extends Monad<A> {
    /* the method caseOf is inspire by https://github.com/cbowdon/TsMonad */
    caseOf<B>(branch: Maybe.ICaseOf<A,B>): B
  }
  export namespace Maybe {
    export type ICaseOf<A,B>={
      some: (value: A)=>B,
      none: ()=>B
    }
  }


  /*    implements    */
  export const maybe = createUnit({
    'Maybe': (monad: Maybe<any>, value: any)=> {
      if (isDefined(value)) {
        monad.toString = ()=>`Some(${value})`;
      } else {
        monad.bind = ()=>monad;
        monad.toString = ()=>'None()';
      }
      monad.caseOf = function<B>(branch: Maybe.ICaseOf<any,B>) {
        // console.log('branch',branch);
        if (isDefined(value)) {
          return branch.some(value);
        } else {
          return branch.none();
        }
      };
    }
  });


  /*    utils functions    */
  export const some = maybe;
  export const none = ()=>maybe(void 0);


}
export = functional;
