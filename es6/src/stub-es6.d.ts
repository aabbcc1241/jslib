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
