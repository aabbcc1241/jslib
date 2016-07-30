/// <reference path="../../es5/dist/all.d.ts" />
declare module require {
    function load(url: string, cors?: boolean): Promise<any>;
}
declare function objectClone<A>(o: any): A;
