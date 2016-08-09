import {JsMap} from "./utils-es5"
import {NativeArray, NativeHTMLElement, NativeHTMLCollection} from "./native-alias"

module jslib {
  export interface Array<T> extends NativeArray<T> {
    pushIfNotExist(t:T):T[];
    clear():T[];
    flatten<R>():R[];
    // collect(f:(t:T)=>boolean):T[];
    collect<R>(f:(t:T)=>R):R[];
    flatMap<R>(f:(t:T)=>R):R[];
    count(f:(t:T)=>boolean):number;
    groupBy(keyer:(t:T)=>number|string):JsMap<T[]>;
    group(size:number):Array<T[]>;
    head():T;
    tail():T[];
    last():T;
  }
  export var Array = <{prototype:Array<any>}> <any> NativeArray;

  export interface HTMLElement extends NativeHTMLElement {
    /**@return parentNode if found (only first matched node), false if not found */
    findParent(parentFilter:(parent:HTMLElement)=>boolean):HTMLElement|boolean;
    [key:string]:any; // only in chrome
  }
  export var HTMLElement = <{prototype:HTMLElement}> <any> NativeHTMLElement;

  export interface HTMLCollection extends NativeHTMLCollection {
    toArray():HTMLElement[]
  }
  export var HTMLCollection = <{prototype:HTMLCollection}> <any> NativeHTMLCollection;
}
export = jslib;
