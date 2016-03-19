declare var $:any;

function toArray(htmlCollection) {
  return [].slice.call(htmlCollection);
}

function pushIfNotExist(arr:any[], o:any):boolean {
  if (arr.indexOf(o) == -1) {
    arr.push(o);
    return true;
  }
  return false;
}

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

/**@return parentNode if found (only first matched node), false if not found */
function findParent(node, parentFilter) {
  for (var parent = node; ;) {
    parent = parent.parentNode;
    if (parent == null)
      return false;
    else if (parentFilter(parent))
      return parent;
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
function ifval<A>(b:boolean, t:A, f:A) {
  if (b)return t; else return f;
}

