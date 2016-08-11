import {JsMap} from "./utils-es5"
import {RichArray, RichHTMLElement, RichHTMLCollection, castRichArray, EmptyArray} from "./polyfill-stub";

/* avoid filling on nodejs server */
if (typeof window !== "undefined") {
  RichHTMLElement.prototype.findParent = function (parentFilter: (parent: RichHTMLElement)=>boolean): RichHTMLElement|boolean {
    for (let parent = this; ;) {
      parent = parent.parentElement;
      if (parent == null)
        return false;
      else if (parentFilter(parent))
        return parent;
    }
  };
  /** @deprecated **/
  const findParent = RichHTMLElement.prototype.findParent;
}

/* avoid filling on nodejs server */
if (typeof window !== "undefined") {
  RichHTMLCollection.prototype.toArray = <()=>RichArray<RichHTMLElement>>Array.prototype.slice;
}


/*
 * this method is in-place, i.e. not creating new array
 * return this for chain-ed operation
 * */
RichArray.prototype.pushIfNotExist = function (x): RichArray<any> {
  if (this.indexOf(x) == -1) {
    this.push(x)
  }
  return this;
};

/*
 * reset the array to zero length
 * return old values
 * */
RichArray.prototype.clear = function (): RichArray<any> {
  return this.splice(0, this.length);
};

/*
 * this operation is not in-place, it create new array
 * @Example : Array<Array<number>> => Array<number>
 * */
RichArray.prototype.flatten = function (): RichArray<any> {
  return castRichArray(
    Array.prototype.concat([], this)
  );
};

RichArray.prototype.collect = function<R>(f: (any: any)=>R|void): RichArray<R> {
  return this.map(f).filter((x: any)=>x !== void 0);
};

RichArray.prototype.flatMap = function <R>(f: (any: any)=>R): RichArray<R> {
  return this.map(f).flatten();
};

RichArray.prototype.count = function (f: (any: any)=>boolean) {
  return this.collect(f).length;
};

RichArray.prototype.groupBy = function (keyer: (any: any)=>number|string): JsMap<RichArray<any>> {
  return this.reduce((acc: JsMap<RichArray<any>>, c: any)=> {
    const k = keyer(c);
    const arr = acc.get(k) || EmptyArray<any>();
    arr.push(c);
    acc.add(k, arr);
    return acc;
  }, new JsMap())
};


/**
 * turn this array into an array of smaller (usually) array
 * @param size : size of sub array
 * @Example : [1,2,3,4,5].group(5) => [[1,2,3,4,5]]
 * @Example : [1,2,3,4,5].group(2) => [[1,2],[3,4],[5]]
 * @Example : [1,2].group(100) => [[1,2]]
 * */
RichArray.prototype.group = function (size: number): RichArray<RichArray<any>> {
  const self = <RichArray<any>> this; // for typescript blame
  const n = self.length;
  const xs = <RichArray<RichArray<any>>> [];
  for (let offset = 0; offset < n; offset += size) {
    xs.push(castRichArray(self.slice(offset, offset + size)));
  }
  return castRichArray(xs);
};

RichArray.prototype.head = function () {
  return this[0]
};

RichArray.prototype.tail = function () {
  return castRichArray(this.slice(1, this.length));
};

RichArray.prototype.last = function () {
  return this[this.length - 1];
};

module jslib {
  // /* tunneling the alias from parent, to avoid importing the parent
  //  * the parent is logically private, but nodejs module doesn't not support the logic */
  // /* does not work? */
  // export var Array = RichArray;
  // export var HTMLElement = RichHTMLElement;
  // export var HTMLCollection = RichHTMLCollection;
}
export = jslib;
