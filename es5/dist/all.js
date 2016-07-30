var horizon;
(function (horizon) {
    horizon.ASCENDING = "ascending";
    horizon.DESCENDING = "descending";
    horizon.INCLUSIVE = "closed";
    horizon.EXCLUSIVE = "open";
})(horizon || (horizon = {}));
HTMLElement.prototype['findParent'] = function (parentFilter) {
    for (var parent_1 = this;;) {
        parent_1 = parent_1.parentElement;
        if (parent_1 == null)
            return false;
        else if (parentFilter(parent_1))
            return parent_1;
    }
};
var findParent = HTMLElement.prototype.findParent;
HTMLCollection.prototype['toArray'] = Array.prototype.slice;
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
Array.prototype['flatten'] = function () {
    return Array.prototype.concat([], this);
};
Array.prototype['collect'] = function (f) {
    return this.map(f).filter(function (x) { return x !== void 0; });
};
Array.prototype['flatMap'] = function (f) {
    return this.map(f).flatten();
};
Array.prototype['count'] = function (f) {
    return this.collect(f).length;
};
Array.prototype['groupBy'] = function (keyer) {
    return this.reduce(function (acc, c) {
        var k = keyer(c);
        var arr = acc.get(k) || [];
        arr.push(c);
        acc.add(k, arr);
        return acc;
    }, new jslib.Map());
};
Array.prototype['group'] = function (size) {
    var self = this;
    var n = self.length;
    var xs = [];
    for (var offset = 0; offset < n; offset += size) {
        xs.push(self.slice(offset, offset + size));
    }
    return xs;
};
Array.prototype['head'] = function () {
    return this[0];
};
Array.prototype['tail'] = function () {
    return this.slice(1, this.length);
};
Array.prototype['last'] = function () {
    return this[this.length - 1];
};
var PROTOTYPE = '__proto__';
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
var noop = (function () {
    function noop() {
    }
    noop.prototype.static = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i - 0] = arguments[_i];
        }
    };
    return noop;
}());
function initProperty(object, propertyName, initValue, replace) {
    if (replace === void 0) { replace = false; }
    if (propertyName.indexOf('.') == -1) {
        if (!isDefined(object[propertyName]) || replace) {
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
function isRadioSelected(radio, container) {
    if (container === void 0) { container = document; }
    var radioName = radio.name;
    var selectedRadio = $('input[name=' + radioName + ']:checked', container);
    return radio.value == selectedRadio.val();
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
function isNumber(s) {
    return s == +s;
}
function toNumber(s) {
    if (isNumber(s))
        return new Number(s).valueOf();
    else
        throw new TypeError("s is not a number");
}
function toArray(o) {
    return Array.prototype.slice.call(o);
}
function cast(x) {
    return x;
}
function empty() {
    return {};
}
function ifVal(b, t, f) {
    if (b)
        return t;
    else
        return f;
}
function ifFunVal(b, fun, v, logError) {
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
function getParamNames(func) {
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}
var jslib;
(function (jslib) {
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
            return this.set(key, value);
        };
        Map.prototype.set = function (key, value) {
            this.map[key] = value;
            return this;
        };
        Map.prototype.remove = function (key) {
            delete (this.map[key]);
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
        Map.prototype.forEach = function (f) {
            var _this = this;
            this.keys()
                .forEach(function (k) {
                f(k, _this.get(k));
            });
        };
        Map.prototype.clear = function () {
            this.map = {};
        };
        Map.prototype.size = function () {
            return this.keys().length;
        };
        return Map;
    }());
    jslib.Map = Map;
})(jslib || (jslib = {}));
function object_constructor(raw) {
    if (!raw)
        throw new ReferenceError('raw is null/undefined');
    if (typeof raw == "string")
        raw = JSON.parse(raw);
    for (var key in raw) {
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
    UID.defaultScope = createScope();
    function Next(scope) {
        if (scope === void 0) { scope = UID.defaultScope; }
        if (!isNumber(scope.lastId))
            scope = UID.defaultScope;
        return ++scope.lastId;
    }
    UID.Next = Next;
    function createScope() {
        return { lastId: 0 };
    }
    UID.createScope = createScope;
})(UID || (UID = {}));
function copyCatConstructor(__this, args) {
    getParamNames(args.callee.caller)
        .forEach(function (x, i) {
        __this[x] = args[i];
    });
}
function forloop(n) {
    return function (f) {
        for (var i = 0; i < n; i++)
            f(i);
    };
}
function getImageSize(url, callback) {
    var img = new Image();
    var called = false;
    img.onload = function () {
        if (called)
            return;
        called = true;
        callback(img.width, img.height, img.width > img.height);
    };
    img.src = url;
    if (img.complete)
        img.onload(void 0);
}
//# sourceMappingURL=all.js.map