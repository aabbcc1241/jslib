var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const PROTOTYPE = '__proto__';
function objectCopy(src, dest, filter = (key, value) => true, recursive = false) {
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
class noop {
    static(...a) {
    }
}
function initProperty(object, propertyName, initValue, replace = false) {
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
function isRadioSelected(radio, container = document) {
    var radioName = radio.name;
    var selectedRadio = $('input[name=' + radioName + ']:checked', container);
    return radio.value == selectedRadio.val();
}
function object_filter_by_type(obj, type, includeInherit = true) {
    return getKeys(obj, includeInherit)
        .filter(key => {
        return typeof (obj[key]) === type;
    });
}
function getKeys(obj, includeInherit = true) {
    if (includeInherit) {
        let keys = [];
        for (var key in obj)
            keys.push(key);
        return keys;
    }
    else
        return Object.keys(obj);
}
function getMaxDepth(obj, includeInherit = true, depth = 0) {
    var keys = getKeys(obj, includeInherit);
    if (keys.length == 0)
        return depth;
    else
        return keys
            .map(k => getMaxDepth(obj[k], includeInherit, depth + 1))
            .reduce((a, c) => a > c ? a : c);
}
function recursiveIterate(o, parentKey = null, includeInherit = true, iterator, callback) {
    var ks = getKeys(o, includeInherit);
    if (ks.length == 0)
        return callback(o, parentKey);
    else
        return iterator(o, (v, k) => recursiveIterate(v, k, includeInherit, iterator, callback));
}
function array_emptyOrFilled(array, emptyCallback, filledCallback) {
    if (array.length == 0)
        emptyCallback();
    else
        filledCallback();
}
function isDefined(value, allowNull = false) {
    return !(typeof value === "undefined" || (!allowNull && value == null));
}
function hasProperty(obj, key, allowNull = false) {
    if (!isDefined(obj, allowNull))
        return false;
    else
        return isDefined(obj[key], allowNull);
}
function ensure(value, allowNull = false, type = null) {
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
function ifFunVal(b, fun, v, logError = false) {
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
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}
var jslib;
(function (jslib) {
    class Map {
        constructor(initMap = {}) {
            if (typeof initMap == "string")
                initMap = JSON.parse(initMap);
            this.map = initMap;
        }
        toString() {
            return JSON.stringify(this.map);
        }
        add(key, value) {
            return this.set(key, value);
        }
        set(key, value) {
            this.map[key] = value;
            return this;
        }
        remove(key) {
            delete (this.map[key]);
            return this;
        }
        get(key) {
            return this.map[key];
        }
        keys() {
            return Object.keys(this.map);
        }
        values() {
            return Object.keys(this.map).map(x => this.map[x]);
        }
        forEach(f) {
            this.keys()
                .forEach(k => {
                f(k, this.get(k));
            });
        }
        clear() {
            this.map = {};
        }
        size() {
            return this.keys().length;
        }
    }
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
    function Next(scope = UID.defaultScope) {
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
        .forEach((x, i) => {
        __this[x] = args[i];
    });
}
function forloop(n) {
    return function (f) {
        for (let i = 0; i < n; i++)
            f(i);
    };
}
function getImageSize(url, callback) {
    let img = new Image();
    let called = false;
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
var require;
(function (require) {
    const pending = new Map();
    const cached = new Set();
    function checkSource(url, cors) {
        return __awaiter(this, void 0, Promise, function* () {
            if (url.indexOf('.') == -1)
                throw new URIError('no sub-filename detected');
            let option = {
                mode: cors ? "cors" : "no-cors",
                cache: "force-cache"
            };
            let response = yield fetch(url, option);
            let text = yield response.text();
            if (text.length == 0) {
                throw new TypeError('empty file');
            }
            else {
                return url.split('.').pop();
            }
        });
    }
    function injectSource(url, cors) {
        return __awaiter(this, void 0, void 0, function* () {
            let filetype = yield checkSource(url, cors);
            return new Promise((resolve, reject) => {
                switch (filetype) {
                    case 'js':
                        let script = document.createElement('script');
                        script.onload = resolve;
                        script.onerror = reject;
                        script.async = true;
                        script.src = url;
                        document.head.appendChild(script);
                        break;
                    case 'css':
                        let link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = url;
                        document.head.appendChild(link);
                        break;
                    default:
                        throw new TypeError('invalid file type :' + filetype);
                }
            });
        });
    }
    function load(url, cors = false) {
        return new Promise((resolve, reject) => {
            if (cached.has(url)) {
                resolve();
            }
            else {
                if (pending.has(url)) {
                    pending.get(url).push([resolve, reject]);
                }
                else {
                    let xss = [[resolve, reject]];
                    pending.set(url, xss);
                    injectSource(url, cors)
                        .then(() => {
                        cached.add(url);
                        xss.forEach(xs => xs[0]());
                        pending.delete(url);
                    })
                        .catch(() => {
                        xss.forEach(xs => xs[1]());
                        pending.delete(url);
                    });
                }
            }
        });
    }
    require.load = load;
})(require || (require = {}));
function objectClone(o) {
    if (o) {
        var res = new noop();
        Object.assign(res, o);
        res[PROTOTYPE] = o[PROTOTYPE];
        return res;
    }
    else
        return o;
}
//# sourceMappingURL=all.js.map