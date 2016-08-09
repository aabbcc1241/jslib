import {JsMap} from "./utils-es5"
import {Array, HTMLElement, HTMLCollection} from "./polyfill-stub"

/* avoid filling on nodejs server */
if (typeof HTMLElement !== "undefined") {
  HTMLElement.prototype.findParent = function (parentFilter:(parent:HTMLElement)=>boolean):HTMLElement|boolean {
    for (let parent = this; ;) {
      parent = parent.parentElement;
      if (parent == null)
        return false;
      else if (parentFilter(parent))
        return parent;
    }
  };
  /** @deprecated **/
  const findParent = HTMLElement.prototype.findParent;
}

/* avoid filling on nodejs server */
if (typeof HTMLCollection !== "undefined") {
  HTMLCollection.prototype.toArray = Array.prototype.slice;
}


/*
 * this method is in-place, i.e. not creating new array
 * return this for chain-ed operation
 * */
Array.prototype.pushIfNotExist = function (x):any[] {
  if (this.indexOf(x) == -1) {
    this.push(x)
  }
  return this;
};

/*
 * reset the array to zero length
 * return old values
 * */
Array.prototype.clear = function ():any[] {
  return this.splice(0, this.length);
};

/*
 * this operation is not in-place, it create new array
 * @Example : Array<Array<number>> => Array<number>
 * */
Array.prototype.flatten = function () {
  return Array.prototype.concat([], this);
};

Array.prototype.collect = function<R>(f:(any:any)=>R|void):R[] {
  return this.map(f).filter((x:any)=>x !== void 0);
};

Array.prototype.flatMap = function <R>(f:(any:any)=>R):R[] {
  return this.map(f).flatten();
};

Array.prototype.count = function (f:(any:any)=>boolean) {
  return this.collect(f).length;
};

Array.prototype.groupBy = function (keyer:(any:any)=>number|string):JsMap<any[]> {
  return this.reduce((acc:JsMap<any[]>, c:any)=> {
    const k = keyer(c);
    const arr = acc.get(k) || [];
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
Array.prototype.group = function (size:number):Array<any[]> {
  const self = <Array<any[]>> this; // for typescript blame
  const n = self.length;
  const xs = <Array<any[]>> [];
  for (let offset = 0; offset < n; offset += size) {
    xs.push(self.slice(offset, offset + size));
  }
  return xs;
};

Array.prototype.head = function () {
  return this[0]
};

Array.prototype.tail = function () {
  return this.slice(1, this.length);
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

module jslib {
}
export = jslib;
