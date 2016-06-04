var _this = this;
function objectCopy(src, dest, filter, recursive) {
    if (filter === void 0) { filter = function (key, value) { return true; }; }
    if (recursive === void 0) { recursive = false; }
    if (src == null || dest == null)
        throw Error('src and dest should not be null');
    for (var key in src) {
        var value = src[key];
        if (filter(key, value)) {
            if (recursive && value != null && typeof (value) === 'object' && !(value instanceof Array)) {
                var clonedValue = {};
                objectCopy(value, clonedValue, filter, recursive);
                dest[key] = clonedValue;
            }
            else {
                dest[key] = value;
            }
        }
    }
}
/**
 * @return true if the value has been set, false if the value is not modified
 * */
function initProperty(object, propertyName, initValue, replace) {
    if (replace === void 0) { replace = false; }
    if (propertyName.indexOf('.') == -1) {
        if (object[propertyName] === undefined || replace) {
            object[propertyName] = initValue;
            return true;
        }
        else
            return false;
    }
    else {
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
function isRadioSelected(radio, container) {
    if (container === void 0) { container = document; }
    var radioName = radio.name;
    var selectedRadio = $('input[name=' + radioName + ']:checked', container);
    return radio.value == selectedRadio.val();
}
/**@return parentNode if found (only first matched node), false if not found */
HTMLElement.prototype['findParent'] = function (parentFilter) {
    for (var parent = _this;;) {
        parent = parent.parentNode;
        if (parent == null)
            return false;
        else if (parentFilter(parent))
            return parent;
    }
};
/** @deprecated **/
function findParent(node, parentFilter) {
    for (var parent = node;;) {
        parent = parent.parentNode;
        if (parent == null)
            return false;
        else if (parentFilter(parent))
            return parent;
    }
}
function object_filter_by_type(obj, type, includeInherit) {
    if (includeInherit === void 0) { includeInherit = true; }
    return getKeys(obj, includeInherit)
        .filter(function (key) {
        return typeof (obj[key]) === type;
    });
}
function getKeys(obj, includeInherit) {
    if (includeInherit === void 0) { includeInherit = true; }
    if (includeInherit) {
        var keys = [];
        for (var key in obj)
            keys.push(key);
        return keys;
    }
    else
        return Object.keys(obj);
}
function getMaxDepth(obj, includeInherit, depth) {
    if (includeInherit === void 0) { includeInherit = true; }
    if (depth === void 0) { depth = 0; }
    var keys = getKeys(obj, includeInherit);
    if (keys.length == 0)
        return depth;
    else
        return keys
            .map(function (k) { return getMaxDepth(obj[k], includeInherit, depth + 1); })
            .reduce(function (a, c) { return a > c ? a : c; });
}
function recursiveIterate(o, parentKey, includeInherit, iterator, callback) {
    if (parentKey === void 0) { parentKey = null; }
    if (includeInherit === void 0) { includeInherit = true; }
    var ks = getKeys(o, includeInherit);
    if (ks.length == 0)
        return callback(o, parentKey);
    else
        return iterator(o, function (v, k) { return recursiveIterate(v, k, includeInherit, iterator, callback); });
}
/** @deprecated not helpful */
function array_emptyOrFilled(array, emptyCallback, filledCallback) {
    if (array.length == 0)
        emptyCallback();
    else
        filledCallback();
}
function isDefined(value, allowNull) {
    if (allowNull === void 0) { allowNull = false; }
    return !(typeof value === "undefined" || (!allowNull && value == null));
}
function hasProperty(obj, key, allowNull) {
    if (allowNull === void 0) { allowNull = false; }
    if (!isDefined(obj, allowNull))
        return false;
    else
        return isDefined(obj[key], allowNull);
}
function ensure(value, allowNull, type) {
    if (allowNull === void 0) { allowNull = false; }
    if (type === void 0) { type = null; }
    if (isDefined(value, allowNull))
        if (isDefined(type))
            if (typeof value == type)
                return value;
            else
                throw new TypeError(value + ' is not ' + type);
        else
            return value;
    else
        throw new ReferenceError();
}
/*    Lang utils    */
HTMLCollection.prototype['toArray'] = Array.prototype.slice;
/** @deprecated **/
function toArray(htmlCollection) {
    return [].slice.call(htmlCollection);
}
Array.prototype['pushIfNotExist'] = function (x) {
    if (this.indexOf(x) == -1) {
        this.push(x);
    }
    return this;
};
Array.prototype['clear'] = function () {
    this.splice(0, this.length);
    return this;
};
// this operation is not in-place, it create new array
Array.prototype['flatten'] = function () {
    return Array.prototype.concat([], this);
};
Array.prototype['collect'] = function (f) {
    return this.map(function (x) { return ifVal(f(x), x, void 0); }).filter(function (x) { return x !== void 0; });
};
Array.prototype['flatMap'] = function (f) {
    return this.map(f).flatten();
};
Array.prototype['count'] = function (f) {
    return this.collect(f).length;
};
Array.prototype['group'] = function (keyer) {
    return this.reduce(function (acc, c) {
        var k = keyer(c);
        if (acc[k])
            acc[k].push(c);
        else
            acc[k] = [c];
        return acc;
    }, []);
};
Array.prototype['head'] = function () {
    return this[0];
};
Array.prototype['tail'] = function () {
    return this.slice(1, this.length);
};
/* just syntax sugar */
function cast(x) {
    return x;
}
/* this function is used to replace the case below :
 * val v;
 * if(b)
 *   v=t;
 * else
 *   v=f;
 **/
function ifVal(b, t, f) {
    if (b)
        return t;
    else
        return f;
}
function ifFunVal(b, fun, v, logError) {
    if (b === void 0) { b = true; }
    if (logError === void 0) { logError = false; }
    if (!b)
        return v;
    try {
        return fun();
    }
    catch (e) {
        if (logError)
            console.error(e);
        return v;
    }
}
function xor(a, b) {
    return !!(a ^ b);
}
function sign(a) {
    return ifVal(a > 0, 1, ifVal(a < 0, -1, 0));
}
function swap(o, a, b) {
    var t = o[a];
    o[a] = o[b];
    o[b] = t;
}
var Map = (function () {
    function Map(initMap) {
        if (initMap === void 0) { initMap = {}; }
        if (typeof initMap == "string")
            initMap = JSON.parse(initMap);
        this.map = initMap;
    }
    Map.prototype.toString = function () {
        return JSON.stringify(this.map);
    };
    Map.prototype.add = function (key, value) {
        this.map[key] = value;
        return this;
    };
    Map.prototype.get = function (key) {
        return this.map[key];
    };
    Map.prototype.keys = function () {
        return Object.keys(this.map);
    };
    Map.prototype.values = function () {
        var _this = this;
        return Object.keys(this.map).map(function (x) { return _this.map[x]; });
    };
    Map.prototype.clear = function () {
        this.map = {};
    };
    Map.prototype.size = function () {
        return this.keys().length;
    };
    return Map;
}());
function isNumber(x) {
    return x == x * 1;
}
function object_constructor(raw) {
    if (!raw)
        throw new ReferenceError('raw is null/undefined');
    if (typeof raw == "string")
        raw = JSON.parse(raw);
    // console.log('new userprofile', o);
    for (var key in raw) {
        /* skip number */
        if (isNumber(key))
            continue;
        this[key] = raw[key];
    }
}
function parseOrRaw(o) {
    if (typeof o === "string")
        return JSON.parse(o);
    else
        return o;
}
var UID;
(function (UID) {
    UID.defaultScope = { lastId: 0 };
    function Next(scope) {
        if (scope === void 0) { scope = UID.defaultScope; }
        if (!isNumber(scope.lastId))
            scope = UID.defaultScope;
        return ++scope.lastId;
    }
    UID.Next = Next;
})(UID || (UID = {}));
//# sourceMappingURL=utils.js.map