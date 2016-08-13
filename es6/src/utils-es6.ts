/**
 * Created by beenotung on 7/29/16.
 */
import {PROTOTYPE, NOOP, Producer} from "../../es5/src/utils-es5";

import _fetch = require("isomorphic-fetch");
var fetch: IFetchStatic;
fetch = _fetch;

module jslib {

  /* mainly to run in browser */
  export module require {
    type PendingCallback=[NOOP,NOOP];
    const pending = new Map<string,PendingCallback[]>();
    const cached = new Set<string>();

    /**@return file extension*/
    async function checkSource(url: string, cors: boolean): Promise<[string,string]> {
      if (url.indexOf('.') == -1)
        throw new URIError('no sub-filename detected');
      let option = <RequestInit>{
        mode: cors ? "cors" : "no-cors"
        , cache: "force-cache"
      };
      let response = await fetch(url, option);
      let text: string = await response.text();
      if (text.length == 0) {
        throw new TypeError('empty file')
      } else {
        return <[string,string]>[url.split('.').pop(), text];
      }
    }

    async function injectSource(url: string, cors: boolean, scopedEval?: (code: string)=>void): Promise<string> {
      let [filetype,filecontent] = await checkSource(url, cors);
      return new Promise((resolve: NOOP, reject: NOOP)=> {
        if (typeof window === 'undefined')
          if (filetype == 'js') {
            let result: any;
            if (scopedEval)
              scopedEval(filecontent);
            else
              eval(filecontent);
            resolve(result);
          }
          else
            reject(new TypeError('invalid file type (server side nodejs) :' + filetype));
        else
          switch (filetype) {
            case 'js':
              let script = document.createElement('script');
              script.onload = ()=>resolve(filecontent);
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
              reject(new TypeError('invalid file type :' + filetype));
          }
      });
    }

    export function load(url: string, cors = false, scopedEval: (code: string)=>void) {
      /* check if in nodejs or browser */
      return new Promise((resolve: NOOP, reject: NOOP)=> {
        if (cached.has(url)) {
          resolve()
        } else {
          if (pending.has(url)) {
            pending.get(url).push([resolve, reject])
          } else {
            let xss = [<PendingCallback>[resolve, reject]];
            pending.set(url, xss);
            injectSource(url, cors, scopedEval)
              .then((code?: string)=> {
                cached.add(url);
                xss.forEach(xs=>xs[0](code));
                pending.delete(url);
              })
              .catch((e)=> {
                xss.forEach(xs=>xs[1](e));
                pending.delete(url);
              });
          }
        }
      });
    }
  }

  export function objectClone<A>(o: any): A {
    if (o) {
      var res: any;
      if (typeof o === 'function')
        res = ()=> {
        };
      else if (Array.isArray(o))
        res = [];
      else if (typeof o === 'object')
        res = {};
      Object.assign(res, o);
      res[PROTOTYPE] = o[PROTOTYPE];
      return res;
    } else return o;
  }

  export interface Defer<T> {
    promise: Promise<T>;
    resolve: (t?: T)=>void;
    reject: (error?: any)=>void;
  }
  export function defer<T>() {
    let defer = <Defer<T>>{};
    defer.promise = new Promise<T>((resolve, reject)=> {
      defer.resolve = resolve;
      defer.reject = reject;
    });
    return defer;
  }

  export async function run<A>(func: Producer<A>): Promise<A> {
    return new Promise<A>((resolve, reject)=> {
      try {
        resolve(func());
      } catch (e) {
        reject(e);
      }
    });
  }

  export function resolveOnce<A>(promise: Promise<A>): AsyncLazy<A> {
    return new AsyncLazy(()=>promise);
  }

  export class AsyncLazy<T> {
    private fun: Producer<Promise<T>>;
    private promise: Promise<T>;

    constructor(fun: Producer<Promise<T>>) {
      this.fun = fun;
    }

    async get(): Promise<T> {
      if (!this.promise)
        this.promise = this.fun();
      return Promise.resolve(this.promise);
    }
  }
  export class Lazy<T> {
    private ready = false;
    private fun: Producer<T>;
    private value: T;

    constructor(fun: Producer<T>) {
      this.fun = fun;
    }

    get(): T {
      if (this.ready)
        return this.value;
      else {
        this.value = this.fun();
        this.ready = true;
        return this.value;
      }
    }
  }
}

export = jslib;
