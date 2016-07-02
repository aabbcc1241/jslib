///<reference path="../rxjs/ts/rx.all.d.ts"/>
///<reference path="stub.d.ts"/>
declare var $:any;
const PROTOTYPE = '__proto__';

function objectCopy(src:any, dest:any, filter:Function = (key:string, value:any)=>true, recursive:boolean = false) {
  if (src == null || dest == null)
    throw Error('src and dest should not be null');
  for (var key in src) {
    var value = src[key];
    if (filter(key, value)) {
      if (recursive && value != null && typeof (value) === 'object' && !(value instanceof Array)) {
        var clonedValue = {};
        objectCopy(value, clonedValue, filter, recursive);
        dest[key] = clonedValue;
      } else {
        dest[key] = value;
      }
    }
  }
}
function objectClone(o) {
  if (o) {
    var res = new noop();
    Object.assign(res, o);
    res[PROTOTYPE] = o[PROTOTYPE];
    return res;
  } else return o;
}

/**
 * @return true if the value has been set, false if the value is not modified
 * */
function initProperty(object, propertyName:string, initValue, replace = false):boolean {
  if (propertyName.indexOf('.') == -1) {
    if (!isDefined(object[propertyName]) || replace) {
      object[propertyName] = initValue;
      return true;
    }
    else
      return false;
  } else {
    var hasSet = false;
    var propertyNames = propertyName.split('.');
    var currentNode = object;
    propertyNames.forEach(function (propertyName, index) {
      if (index == (propertyNames.length - 1))
        hasSet = initProperty(currentNode, propertyName, initValue) || hasSet;
      else
        hasSet = initProperty(currentNode, propertyName, {}) || hasSet;
      currentNode = currentNode[propertyName];
    });
    return hasSet;
  }
}

/**
 * @param radio : HTMLInputElement
 * @param container : HTMLElement|Document
 * @return boolean
 * */
function isRadioSelected(radio:HTMLInputElement, container:HTMLElement|Document = document):boolean {
  var radioName = radio.name;
  var selectedRadio = $('input[name=' + radioName + ']:checked', container);
  return radio.value == selectedRadio.val();
}

/**@return parentNode if found (only first matched node), false if not found */
HTMLElement.prototype['findParent'] = (parentFilter)=> {
  for (var parent = this; ;) {
    parent = parent.parentNode;
    if (parent == null)
      return false;
    else if (parentFilter(parent))
      return parent;
  }
};

/** @deprecated **/
function findParent(node, parentFilter) {
  for (var parent = node; ;) {
    parent = parent.parentNode;
    if (parent == null)
      return false;
    else if (parentFilter(parent))
      return parent;
  }
}

function object_filter_by_type(obj:any, type:string, includeInherit = true):any[] {
  return getKeys(obj, includeInherit)
    .filter(key=> {
      return typeof (obj[key]) === type;
    });
}

function getKeys(obj:any, includeInherit = true):string[] {
  if (includeInherit) {
    var keys = [];
    for (var key in obj)
      keys.push(key);
    return keys;
  } else
    return Object.keys(obj);
}

function getMaxDepth(obj:any, includeInherit = true, depth = 0):number {
  var keys = getKeys(obj, includeInherit);
  if (keys.length == 0)
    return depth;
  else
    return keys
      .map(k=>getMaxDepth(obj[k], includeInherit, depth + 1))
      .reduce((a, c)=> a > c ? a : c);
}

function recursiveIterate(o:any, parentKey:any = null, includeInherit = true, iterator:Function, callback:Function) {
  var ks = getKeys(o, includeInherit);
  if (ks.length == 0)
    return callback(o, parentKey);
  else
    return iterator(o, (v, k)=>recursiveIterate(v, k, includeInherit, iterator, callback));
}

/** @deprecated not helpful */
function array_emptyOrFilled(array:any[], emptyCallback:Function, filledCallback:Function) {
  if (array.length == 0)
    emptyCallback();
  else
    filledCallback();
}

function isDefined(value:any, allowNull = false) {
  return !(typeof value === "undefined" || (!allowNull && value == null));
}

function hasProperty(obj:any, key:string, allowNull = false) {
  if (!isDefined(obj, allowNull))
    return false;
  else
    return isDefined(obj[key], allowNull);
}

function ensure(value:any, allowNull = false, type:string = null) {
  if (isDefined(value, allowNull))
    if (isDefined(type))
      if (typeof  value == type)
        return value;
      else
        throw new TypeError(value + ' is not ' + type);
    else // type is not defined
      return value;
  else // value is not defined
    throw new ReferenceError();
}


/*    Lang utils    */
HTMLCollection.prototype['toArray'] = Array.prototype.slice;
declare interface HTMLCollection {
  toArray():HTMLElement[]
}

function toArray<A>(o):Array<A> {
  return Array.prototype.slice.call(o);
}

/*
 * this method is in-place, i.e. not creating new array
 * return this for chain-ed operation
 * */
Array.prototype['pushIfNotExist'] = function (x) {
  if (this.indexOf(x) == -1) {
    this.push(x)
  }
  return this;
};

Array.prototype['clear'] = function () {
  this.splice(0, this.length);
  return this;
};

/*
 * this operation is not in-place, it create new array
 * @Example : Array<Array<number>> => Array<number>
 * */
Array.prototype['flatten'] = function () {
  return Array.prototype.concat([], this);
};

Array.prototype['collect'] = function<R>(f:(any)=>R):R[] {
  // return this.map(x=>ifVal(f(x), x, void 0)).filter(x=>x !== void 0);
  return this.map(f).filter(x=>x !== void 0);
};

Array.prototype['flatMap'] = function (f:(any)=>any) {
  return this.map(f).flatten();
};

Array.prototype['count'] = function (f:(any)=>boolean) {
  return this.collect(f).length;
};

Array.prototype['groupBy'] = function (keyer:(any)=>number|string):Map<any[]> {
  return this.reduce((acc:Map<any[]>, c)=> {
    const k = keyer(c);
    const arr = acc.get(k) || [];
    arr.push(c);
    acc.add(k, arr);
    return acc;
  }, new Map())
};

/**
 * turn this array into an array of smaller (usually) array
 * @param size : size of sub array
 * @Example : [1,2,3,4,5].group(5) => [[1,2,3,4,5]]
 * @Example : [1,2,3,4,5].group(2) => [[1,2],[3,4],[5]]
 * @Example : [1,2].group(100) => [[1,2]]
 * */
Array.prototype['group'] = function (size:number):Array<any[]> {
  const self:any[] = this; // for typescript blame
  const n = self.length;
  const xs:Array<any[]> = [];
  for (let offset = 0; offset < n; offset += size) {
    xs.push(self.slice(offset, offset + size));
  }
  return xs;
};

Array.prototype['head'] = function () {
  return this[0]
};

Array.prototype['tail'] = function () {
  return this.slice(1, this.length);
};

Array.prototype['last'] = function () {
  return this[this.length - 1];
};

declare interface Array<T> {
  pushIfNotExist(t:T):T[];
  clear();
  flatten<R>():R[];
  // collect(f:(t:T)=>boolean):T[];
  collect<R>(f:(t:T)=>R):R[];
  flatMap<R>(f:(t:T)=>R):R[];
  count(f:(t:T)=>boolean):number;
  groupBy(keyer:(t:T)=>number|string):Map<T[]>;
  group(size:number):Array<T[]>;
  head():T;
  tail():T[];
  last():T;
}

/* just syntax sugar */
function cast<A>(x:any):A {
  return x;
}
/** just syntax sugar
 * @deprecated not really a sugar
 * */
function empty<A>():A {
  return <A>{};
}

/* this function is used to replace the case below :
 * val v;
 * if(b)
 *   v=t;
 * else
 *   v=f;
 **/
function ifVal<A>(b:boolean, t:A, f:A) {
  if (b)return t; else return f;
}

function ifFunVal<A>(b = true, fun:()=>A, v:A, logError = false) {
  if (!b)return v;
  try {
    return fun();
  } catch (e) {
    if (logError)
      console.error(e);
    return v
  }
}

function xor(a, b):boolean {
  return !!(a ^ b);
}

function sign(a:number):number {
  return ifVal(a > 0, 1, ifVal(a < 0, -1, 0));
}

function swap(o:any, a, b:string) {
  var t = o[a];
  o[a] = o[b];
  o[b] = t;
}

//reference : http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
function getParamNames(func):string[] {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}

class Map<V> {
  private map;

  constructor(initMap:string|any = {}) {
    if (typeof initMap == "string")
      initMap = JSON.parse(initMap);
    this.map = initMap;
  }

  toString() {
    return JSON.stringify(this.map);
  }

  /**@deprecated*/
  add(key:string|number, value:V) {
    return this.set(key, value);
  }

  set(key:string|number, value:V) {
    this.map[key] = value;
    return this;
  }

  remove(key:string|number) {
    delete(this.map[key]);
    return this;
  }

  get(key:string|number) {
    return this.map[key];
  }

  keys():(string|number)[] {
    return Object.keys(this.map);
  }

  values() {
    return Object.keys(this.map).map(x=>this.map[x]);
  }

  clear() {
    this.map = {}
  }

  size() {
    return this.keys().length
  }
}

function isNumber(x):boolean {
  return x == x * 1;
}

function object_constructor(raw) {
  if (!raw)
    throw new ReferenceError('raw is null/undefined');
  if (typeof  raw == "string")
    raw = JSON.parse(raw);
  // console.log('new userprofile', o);
  for (var key in raw) {
    /* skip number */
    if (isNumber(key))
      continue;
    this[key] = raw[key]
  }
}

function parseOrRaw(o:any|string):any {
  if (typeof o === "string")
    return JSON.parse(o);
  else
    return o;
}

module UID {
  export const defaultScope = createScope();

  export function Next(scope = UID.defaultScope):number {
    if (!isNumber(scope.lastId))
      scope = UID.defaultScope;
    return ++scope.lastId;
  }

  export function createScope() {
    return {lastId: 0};
  }
}

const noop = ()=> {
};

/*    Angular libs    */

/*
 * used as the default constructor of typed service (or even controller) that depends/need to used other $stuff, e.g. $translate, $ionicPopup
 * it loop the call.caller arguments and copy to local (private) variable
 *
 * example :
 * ```
 * constructor(){
 *   copyCatConstructor(this, arguments);
 *   // other custom stuff
 * }
 * ```
 * */
function copyCatConstructor(__this, args:IArguments) {
  getParamNames(args.callee.caller)
    .forEach((x, i)=> {
      __this[x] = args[i];
      // console.log('set', x, args[i]);
    });
}

/*
 * loop from zero to n, exclusing n
 * */
function forloop(n:number):((f:(i:number)=>void)=>void) {
  // return new Array(n).forEach((_, i)=>f(i));
  return function (f:(i:number)=>void) {
    for (let i = 0; i < n; i++)
      f(i);
  };
}

/* TODO detect error */
function getImageSize(url:string, callback:(width:number, height:number, isLandscape:boolean)=>void) {
  let img = new Image();
  let called = false;
  img.onload = function () {
    if (called)
      return;
    called = true;
    callback(img.width, img.height, img.width > img.height)
  };
  img.src = url;
  if (img.complete)
    img.onload(void 0); // pass undefined event
}
