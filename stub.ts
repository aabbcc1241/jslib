/**
 * for typescript compiler and dev-time reference only,
 * DO NOT include in html
 *
 * Created by node on 5/28/16.
 */

module rxjs {
  export interface Observable<A> {
    subscribe(success?:(a:A)=>void,
              fail?:(err)=>void,
              complete?:()=>void)
  }
  export interface TableQuery<A> {
    fetch():Observable<A>
  }
  export interface FindQuery<A> extends TableQuery<A> {
    defaultIfEmpty():TableQuery<A>
  }
  export interface CreatedObject {
    id:string;
  }
  export interface TableObject<A> {
    find(o):FindQuery<A>
    findAll(...o):TableQuery<A[]>
    remove(o):TableObject<A>
    removeAll(o):Observable<A>
    store(o):Observable<CreatedObject>
    replace(...o):Observable<CreatedObject>
    fetch():Observable<A[]>
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
