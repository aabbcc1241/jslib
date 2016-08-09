/**
 * Created by beenotung on 8/9/16.
 */

module jslib {
  export type NativeArray<T> = Array<T>;
  export var NativeArray = Array;

  var window:Window;

  function dummy() {
    return {prototype: {}}
  }

  export type NativeHTMLElement =HTMLElement;
  export var NativeHTMLElement = window ? HTMLElement : dummy();

  export type NativeHTMLCollection = HTMLCollection;
  export var NativeHTMLCollection = window ? HTMLCollection : dummy();
}
export = jslib
