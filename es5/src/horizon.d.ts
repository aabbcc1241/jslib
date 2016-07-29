/**
 * for typescript compiler and dev-time reference only,
 * DO NOT include in html
 *
 * Created by beenotung on 5/28/16.
 */

///<reference path="lib.ts"/>

declare namespace Horizon {
  export interface TableQuery<A> extends FinalQuery<A> {
    order(field:string, direction?:string):OrderQuery<A> // default ascending
    above(idOrObject:string|any, type?:string):OrderQuery<A> // default open(exclusive)
  }
  export interface FinalQuery<A> {
    limit(max:number):LimitedFinalQuery<A>
    fetch():Rx.Observable<A[]>
  }
  export interface SingleFinalQuery<A> extends Rx.Observable<A> {
    defaultIfEmpty():Rx.Observable<A>
  }
  export interface LimitedFinalQuery<A> {
    fetch():Rx.Observable<A[]>
  }
  export interface OrderQuery<A> extends FinalQuery<A> {
    below(idOrObject:string|any, type?:string):FinalQuery<A[]> // default open(exclusive)
  }
  export interface FindQuery<A> {
    fetch():SingleFinalQuery<A>
  }
  export interface CreatedObject {
    id:string;
  }
  export interface TableObject<A> extends TableQuery<A> {
    find(o):FindQuery<A>
    findAll(...o):TableQuery<A>
    insert(o):TableObject<CreatedObject>
    remove(o):TableObject<CreatedObject>
    removeAll(o):Rx.Observable<CreatedObject>
    replace(...o):Rx.Observable<CreatedObject>
    store(o):Rx.Observable<CreatedObject>
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

  find<A>():Rx.Observable<A>

  call<A>(_this, table:string):Horizon.TableObject<A>

  currentUser():Horizon.TableQuery<any>

  hasAuthToken()

  connect()

  onReady(f:Function)

  onDisconnected(f:Function)

  onSocketError(f:Function)
}
