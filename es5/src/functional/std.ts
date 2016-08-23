/**
 * the standard monads
 * */

import {M, def_monad, types, def_type, unit} from "./monad";
import {isDefined} from"../utils-es5";
module functional {
  /* config */
  {
    let maybe = types.monad.extend('maybe', types.any);
    // let some = maybe.extend('some');
    // let none = maybe.extend('none');
  }

  /* impls */
  const maybe = def_monad('maybe', types.any, (monad: M<any>, value: any)=> {
    if (!isDefined(value)) {
      monad.bind
        = monad.flatmap
        = monad.chain
        = ()=>monad;
    }
  });

  /* functions */
}
// module functional_old {
//   /*    interfaces    */
//   export interface Maybe<A>extends Monad<A> {
//     /* the method caseOf is inspire by https://github.com/cbowdon/TsMonad */
//     caseOf<B>(branch: Maybe.ICaseOf<A,B>): B
//   }
//   export namespace Maybe {
//     export type ICaseOf<A,B>={
//       some: (value: A)=>B,
//       none: ()=>B
//     }
//   }
//
//
//   /*    implements    */
//   export const maybe = createUnit({
//     'Maybe': (monad: Maybe<any>, value: any)=> {
//       if (isDefined(value)) {
//         monad.toString = ()=>`Some(${value})`;
//       } else {
//         monad.bind = ()=>monad;
//         monad.toString = ()=>'None()';
//       }
//       monad.caseOf = function<B>(branch: Maybe.ICaseOf<any,B>) {
//         // console.log('branch',branch);
//         if (isDefined(value)) {
//           return branch.some(value);
//         } else {
//           return branch.none();
//         }
//       };
//     }
//   });
//
//
//   /*    utils functions    */
//   export const some = maybe;
//   export const none = ()=>maybe(void 0);
//
//
// }
export = functional;
