/**
 * Created by beenotung on 7/29/16.
 */
///<reference path="lib.ts"/>

module require {
  type PendingCallback=[NOOP,NOOP];
  const pending = new Map<string,PendingCallback[]>();
  const cached = new Set<string>();

  /**@return file extension*/
  async function checkSource(url:string, cors:boolean):Promise<string> {
    if (url.indexOf('.') == -1)
      throw new URIError('no sub-filename detected');
    let option = {
      mode: cors ? 'cors' : 'no-cors'
      , cache: 'force-cache'
    };
    let response = await fetch(url, option);
    let text = await response.text();
    if (text.length == 0) {
      throw new TypeError('empty file')
    } else {
      return url.split('.').pop();
    }
  }

  async function injectSource(url:string, cors:boolean) {
    let filetype = await checkSource(url, cors);
    return new Promise((resolve, reject)=> {
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
  }

  export function load(url:string, cors = false) {
    return new Promise((resolve:NOOP, reject:NOOP)=> {
      if (cached.has(url)) {
        resolve()
      } else {
        if (pending.has(url)) {
          pending.get(url).push([resolve, reject])
        } else {
          let xss = [<PendingCallback>[resolve, reject]];
          pending.set(url, xss);
          injectSource(url, cors)
            .then(()=> {
              cached.add(url);
              xss.forEach(xs=>xs[0]());
              pending.delete(url);
            })
            .catch(()=> {
              xss.forEach(xs=>xs[1]());
              pending.delete(url);
            });
        }
      }
    });
  }
}

/**@deprecated use Object.assign and Object.create instaed */
function objectClone<A>(o:A):A {
  if (o) {
    var res:A = cast<A>(new noop());
    Object.assign(res, o);
    res[PROTOTYPE] = o[PROTOTYPE];
    return res;
  } else return o;
}