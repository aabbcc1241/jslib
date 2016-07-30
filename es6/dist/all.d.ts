declare const PROTOTYPE: string;
declare function objectCopy(src: any, dest: any, filter?: Function, recursive?: boolean): void;
declare class noop {
    static(...a: any[]): void;
}
declare type NOOP = (...a: any[]) => void;
declare function initProperty(object: any, propertyName: string, initValue: any, replace?: boolean): boolean;
declare function isRadioSelected(radio: HTMLInputElement, container?: HTMLElement | Document): boolean;
declare function object_filter_by_type(obj: any, type: string, includeInherit?: boolean): any[];
declare function getKeys(obj: any, includeInherit?: boolean): string[];
declare function getMaxDepth(obj: any, includeInherit?: boolean, depth?: number): number;
declare function recursiveIterate(o: any, parentKey?: any, includeInherit?: boolean, iterator?: Function, callback?: Function): any;
declare function array_emptyOrFilled(array: any[], emptyCallback: Function, filledCallback: Function): void;
declare function isDefined(value: any, allowNull?: boolean): boolean;
declare function hasProperty(obj: any, key: string, allowNull?: boolean): boolean;
declare function ensure(value: any, allowNull?: boolean, type?: string): any;
declare function isNumber(s: string | number): boolean;
declare function toNumber(s: string): number;
declare function toArray<A>(o: any): Array<A>;
declare function cast<A>(x: any): A;
declare function empty<A>(): A;
declare function ifVal<A>(b: boolean, t: A, f: A): A;
declare function ifFunVal<A>(b: boolean, fun: () => A, v: A, logError?: boolean): A;
declare function xor(a: boolean, b: boolean): boolean;
declare function sign(a: number): number;
declare function swap(o: any, a: string, b: string): void;
declare function getParamNames(func: Function): string[];
declare module jslib {
    class Map<V> {
        private map;
        constructor(initMap?: string | any);
        toString(): string;
        add(key: string | number, value: V): this;
        set(key: string | number, value: V): this;
        remove(key: string | number): this;
        get(key: string | number): any;
        keys(): (string | number)[];
        values(): any[];
        forEach(f: (key: string | number, value: V) => void): void;
        clear(): void;
        size(): number;
    }
}
declare function object_constructor(raw: string | any): void;
declare function parseOrRaw(o: any | string): any;
declare module UID {
    type IScope = {
        lastId: number;
    };
    const defaultScope: IScope;
    function Next(scope?: IScope): number;
    function createScope(): IScope;
}
declare function copyCatConstructor(__this: any, args: IArguments): void;
declare function forloop(n: number): ((f: (i: number) => void) => void);
declare function getImageSize(url: string, callback: (width: number, height: number, isLandscape: boolean) => void): void;
declare module require {
    function load(url: string, cors?: boolean): Promise<any>;
}
declare function objectClone<A>(o: any): A;
