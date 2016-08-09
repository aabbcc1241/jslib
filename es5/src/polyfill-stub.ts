import {JsMap} from "./utils-es5"
import {NativeArray, NativeHTMLElement, NativeHTMLCollection} from "./native-alias"

module jslib {
  export interface RichArray<T> extends NativeArray<T> {
    pushIfNotExist(t:T):T[];
    clear():T[];
    flatten<R>():R[];
    // collect(f:(t:T)=>boolean):T[];
    collect<R>(f:(t:T)=>R):R[];
    flatMap<R>(f:(t:T)=>R):R[];
    count(f:(t:T)=>boolean):number;
    groupBy(keyer:(t:T)=>number|string):JsMap<T[]>;
    group(size:number):RichArray<T[]>;
    head():T;
    tail():T[];
    last():T;
  }

  export var RichArray = <{
    prototype:RichArray<any>,
  }> <any> NativeArray;

  /* ensure the element type is same */
  export function castRichArray<T>(arr:Array<T>):RichArray<T> {
    return <RichArray<T>>arr;
  }

  export function EmptyArray<T>():RichArray<T> {
    // return castRichArray<T>([]);
    return <RichArray<T>>[];
  }

  export interface RichHTMLElement extends NativeHTMLElement {
    /**@return parentNode if found (only first matched node), false if not found */
    findParent(parentFilter:(parent:RichHTMLElement)=>boolean):RichHTMLElement|boolean;
    [key:string]:any; // only in chrome
  }
  export var RichHTMLElement = <{prototype:RichHTMLElement}> <any> NativeHTMLElement;

  export interface RichHTMLCollection extends NativeHTMLCollection {
    toArray():RichHTMLElement[]
  }
  export var RichHTMLCollection = <{prototype:RichHTMLCollection}> <any> NativeHTMLCollection;
}
export = jslib;
