/**
 * for typescript compiler and dev-time reference only,
 * DO NOT include in html
 *
 * Created by beenotung on 5/28/16.
 */

declare interface ObjectConstructor {
  assign(_this:any, ...that:any[]):void;
}

declare interface Window {
  unescape(html_code:string):string;
}

/*    web api    */
declare type Response={
  ok:boolean;
  status:number;
  statusText:string;
  type:string;
  url:string;
  headers:any;
  body:any;
  arrayBuffer():any;
  text():Promise<string>;
  json():any;
  blob():any;
};

declare function fetch(url:string, option:any):Promise<Response>;
/* TODO use https://github.com/matthew-andrews/isomorphic-fetch if not implemented in IE */

