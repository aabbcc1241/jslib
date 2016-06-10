/**
 * for typescript compiler and dev-time reference only,
 * DO NOT include in html
 *
 * Created by node on 5/28/16.
 */

module rxjs {
  export const ASCENDING = "ascending";
  export const DESCENDING = "descending";
  export const INCLUSIVE = "closed";
  const EXCLUSIVE = "open";
  export interface Observable<A> {
    subscribe(success?:(a:A)=>void,
              fail?:(err)=>void,
              complete?:()=>void)
  }
  export interface TableQuery<A> extends FinalQuery<A> {
    order(field:string, direction?:string):OrderQuery<A> // default ascending
    above(idOrObject:string|any, type?):OrderQuery<A> // default open(exclusive)
  }
  export interface FinalQuery<A> {
    limit(max:number):LimitedFinalQuery<A>
    fetch():Observable<A[]>
  }
  export interface SingleFinalQuery<A> {
    fetch():Observable<A>
  }
  export interface LimitedFinalQuery<A> {
    fetch():Observable<A[]>
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
    removeAll(o):Observable<CreatedObject>
    replace(...o):Observable<CreatedObject>
    store(o):Observable<CreatedObject>
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
  export interface Horizon {
    find<A>():Observable<A>
    <A>(table:string):TableObject<A>
    currentUser():TableQuery<any>
    hasAuthToken()
    connect()
    onReady(f:Function)
    onDisconnected(f:Function)
    onSocketError(f:Function)
  }
}
Object['assign'] = function (_this, ...that) {

};
