import {JsMap} from "./utils-es5"
import {NativeArray, NativeHTMLElement, NativeHTMLCollection} from "./native-alias"

module jslib {
  export interface RichArray<T> extends NativeArray<T> {
    pushIfNotExist(t: T): RichArray<T>;
    clear(): RichArray<T>;
    flatten<R>(): RichArray<R>;
    // collect(f:(t:T)=>boolean):RichArray<T>;
    collect<R>(f: (t: T)=>R): RichArray<R>;
    flatMap<R>(f: (t: T)=>R): RichArray<R>;
    count(f: (t: T)=>boolean): number;
    groupBy(keyer: (t: T)=>number|string): JsMap<RichArray<T>>;
    group(size: number): RichArray<RichArray<T>>;
    head(): T;
    tail(): RichArray<T>;
    last(): T;
    contains(searchElement: T, fromIndex?: number): boolean;
  }

  export var RichArray = <{
    prototype: RichArray<any>,
  }> <any> NativeArray;

  /** ensure the element type is same
   * @deprecated **/
  export function castRichArray<T>(arr: T[]|RichArray<T>): RichArray<T> {
    return <RichArray<T>>arr;
  }

  /** @deprecated **/
  export function EmptyArray<T>(): RichArray<T> {
    return <RichArray<T>>[];
  }

  export interface RichHTMLElement extends NativeHTMLElement {
    /**@return parentNode if found (only first matched node), false if not found */
    findParent(parentFilter: (parent: RichHTMLElement)=>boolean): RichHTMLElement|boolean;
    [key: string]: any; // only in chrome
  }
  export var RichHTMLElement = <{prototype: RichHTMLElement}> <any> NativeHTMLElement;

  export interface RichHTMLCollection extends NativeHTMLCollection {
    toArray(): RichArray<RichHTMLElement>
  }
  export var RichHTMLCollection = <{prototype: RichHTMLCollection}> <any> NativeHTMLCollection;

  export interface RichString extends String {
    contains(searchString: string, position?: number): boolean;
  }
  export var RichString = <{prototype: RichString}><any>String;
}
export = jslib;
