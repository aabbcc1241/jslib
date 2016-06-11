/**
 * for typescript compiler and dev-time reference only,
 * DO NOT include in html
 *
 * Created by beenotung on 5/28/16.
 */

///<reference path="utils.ts"/>

declare interface ObjectConstructor {
  assign(_this, ...that)
}

declare module horizon {
  export module Rx {
    export interface Observable<A> {
      subscribe(success?:(a:A)=>void,
                fail?:(err)=>void,
                complete?:()=>void)
    }
  }
  export interface TableQuery<A> extends FinalQuery<A> {
    order(field:string, direction?:string):OrderQuery<A> // default ascending
    above(idOrObject:string|any, type?):OrderQuery<A> // default open(exclusive)
  }
  export interface FinalQuery<A> {
    limit(max:number):LimitedFinalQuery<A>
    fetch():horizon.Rx.Observable<A[]>
  }
  export interface SingleFinalQuery<A> {
    fetch():horizon.Rx.Observable<A>
  }
  export interface LimitedFinalQuery<A> {
    fetch():horizon.Rx.Observable<A[]>
  }
  export interface OrderQuery<A> extends FinalQuery<A> {
    below(idOrObject:string|any, type?):FinalQuery<A[]> // default open(exclusive)
  }
  export interface FindQuery<A> extends SingleFinalQuery<A> {
    defaultIfEmpty():SingleFinalQuery<A>
  }
  export interface CreatedObject {
    id:string;
  }
  export interface TableObject<A> extends TableQuery<A> {
    find(o):FindQuery<A>
    findAll(...o):TableQuery<A>
    insert(o):TableObject<CreatedObject>
    remove(o):TableObject<CreatedObject>
    removeAll(o):horizon.Rx.Observable<CreatedObject>
    replace(...o):horizon.Rx.Observable<CreatedObject>
    store(o):horizon.Rx.Observable<CreatedObject>
    update(o):TableQuery<CreatedObject>
    upsert(o):TableQuery<CreatedObject>
  }
  export interface HorizonConstParam {
    host:string;
    authType:string;
  }
  export interface HorizonConstructor {
    new():Horizon
    new(param:HorizonConstParam):Horizon
    clearAuthToken()
  }
}
declare class Horizon {
  constructor(o?)

  find<A>():horizon.Rx.Observable<A>

  call<A>(_this, table:string):horizon.TableObject<A>

  currentUser():horizon.TableQuery<any>

  hasAuthToken()

  connect()

  onReady(f:Function)

  onDisconnected(f:Function)

  onSocketError(f:Function)
}
/*declare class Object {
 static assign(_this, ...that)
 }*/
