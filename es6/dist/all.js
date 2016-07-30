var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var require;
(function (require) {
    const pending = new Map();
    const cached = new Set();
    function checkSource(url, cors) {
        return __awaiter(this, void 0, Promise, function* () {
            if (url.indexOf('.') == -1)
                throw new URIError('no sub-filename detected');
            let option = {
                mode: cors ? 'cors' : 'no-cors',
                cache: 'force-cache'
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