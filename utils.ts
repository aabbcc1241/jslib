declare var $:any;

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

/**
 * @return true if the value has been set, false if the value is not modified
 * */
function initProperty(object, propertyName:string, initValue, replace = false):boolean {
  if (propertyName.indexOf('.') == -1) {
    if (object[propertyName] === undefined || replace) {
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
    if (type == null)
      return value;
    else
      return typeof value == type;
  else
    throw new ReferenceError();
}


/*    Lang utils    */
HTMLCollection.prototype['toArray'] = Array.prototype.slice;
/** @deprecated **/
function toArray(htmlCollection) {
  return [].slice.call(htmlCollection);
}

Array.prototype['pushIfNotExist'] = (x)=> {
  if (this.indexOf(x) == -1) {
    this.push(x)
  }
  return this;
};
/** @deprecated **/
function pushIfNotExist(arr:any[], o:any):boolean {
  if (arr.indexOf(o) == -1) {
    arr.push(o);
    return true;
  }
  return false;
}

// Object.prototype['cast'] = function <A>():A {
//   return this;
// };

function cast<A>(x:any):A {
  return x;
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

class Map<V> {
  private map;

  constructor(initMap = {}) {
    this.map = initMap;
  }

  toString() {
    return JSON.stringify(this.map);
  }

  add(key:string|number, value:V) {
    this.map[key] = value;
    return this;
  }

  get(key:string|any) {
    return this.map[key];
  }

  keys() {
    return Object.keys(this.map);
  }

  values() {
    return Object.keys(this.map).map(x=>this.map[x]);
  }

  clear() {
    this.map = {}
  }
}

function isNumber(x):boolean {
  return x == x * 1;
}

function object_constructor(o) {
  if (!o)
    throw new ReferenceError('raw is null/undefined');
  if (typeof  o == "string")
    o = JSON.parse(o);
  // console.log('new userprofile', o);
  for (var x in o) {
    /* skip number */
    if (isNumber(x))continue;
    this[x] = o[x]
  }
}
