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

class noop {
  static(...a:any[]):void {
  }
}
type NOOP=(...a:any[])=> void;

/**
 * @return true if the value has been set, false if the value is not modified
 * */
function initProperty(object:any, propertyName:string, initValue:any, replace = false):boolean {
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

function object_filter_by_type(obj:any, type:string, includeInherit = true):any[] {
  return getKeys(obj, includeInherit)
    .filter(key=> {
      return typeof (obj[key]) === type;
    });
}

function getKeys(obj:any, includeInherit = true):string[] {
  if (includeInherit) {
    let keys = <string[]>[];
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

function recursiveIterate(o:any, parentKey:any = null, includeInherit = true, iterator?:Function, callback?:Function) {
  var ks = getKeys(o, includeInherit);
  if (ks.length == 0)
    return callback(o, parentKey);
  else
    return iterator(o, (v:any, k:string)=>recursiveIterate(v, k, includeInherit, iterator, callback));
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
function isNumber(s:string|number):boolean {
  return <any>s == <any>+s;
}

function toNumber(s:string):number {
  if (isNumber(s))
    return new Number(s).valueOf();
  else
    throw new TypeError("s is not a number");
}


function toArray<A>(o:any):Array<A> {
  return Array.prototype.slice.call(o);
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

function ifFunVal<A>(b:boolean, fun:()=>A, v:A, logError = false) {
  if (!b)return v;
  try {
    return fun();
  } catch (e) {
    if (logError)
      console.error(e);
    return v
  }
}

function xor(a:boolean, b:boolean):boolean {
  return !!(<number><any>a ^ <number><any>b);
}

function sign(a:number):number {
  return ifVal(a > 0, 1, ifVal(a < 0, -1, 0));
}

function swap(o:any, a:string, b:string) {
  var t = o[a];
  o[a] = o[b];
  o[b] = t;
}

//reference : http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
function getParamNames(func:Function):string[] {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return <string[]>result;
}

module jslib {
  /** wrapped here to avoid conflict with ES6 (babel-polyfill) */
  export class Map<V> {
    private map:any;

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

    forEach(f:(key:string|number, value:V)=>void) {
      this.keys()
        .forEach(k=> {
          f(k, this.get(k));
        })
    }

    clear() {
      this.map = {}
    }

    size() {
      return this.keys().length
    }
  }
}

function object_constructor(raw:string|any) {
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
  export type IScope={lastId:number};
  export const defaultScope:IScope = createScope();

  export function Next(scope:IScope = UID.defaultScope):number {
    if (!isNumber(scope.lastId))
      scope = UID.defaultScope;
    return ++scope.lastId;
  }

  export function createScope():IScope {
    return {lastId: 0};
  }
}


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
function copyCatConstructor(__this:any, args:IArguments) {
  getParamNames(args.callee.caller)
    .forEach((x, i)=> {
      __this[x] = args[i];
      // console.log('set', x, args[i]);
    });
}

/*
 * loop from zero to n, exclusing n
 * */
export function forloop(n:number):((f:(i:number)=>void)=>void) {
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
