declare const PROTOTYPE: string;
declare function objectCopy(src: any, dest: any, filter?: Function, recursive?: boolean): void;
declare const noop: () => void;
declare function objectClone(o: any): any;
declare function initProperty(object: any, propertyName: string, initValue: any, replace?: boolean): boolean;
declare function isRadioSelected(radio: HTMLInputElement, container?: HTMLElement | Document): boolean;
declare function findParent(node: any, parentFilter: any): any;
declare function object_filter_by_type(obj: any, type: string, includeInherit?: boolean): any[];
declare function getKeys(obj: any, includeInherit?: boolean): string[];
declare function getMaxDepth(obj: any, includeInherit?: boolean, depth?: number): number;
declare function recursiveIterate(o: any, parentKey?: any, includeInherit?: boolean, iterator?: Function, callback?: Function): any;
declare function array_emptyOrFilled(array: any[], emptyCallback: Function, filledCallback: Function): void;
declare function isDefined(value: any, allowNull?: boolean): boolean;
declare function hasProperty(obj: any, key: string, allowNull?: boolean): boolean;
declare function ensure(value: any, allowNull?: boolean, type?: string): any;
declare function isNumber(s: any): boolean;
declare function toNumber(s: any): number;
interface HTMLCollection {
    toArray(): HTMLElement[];
}
declare function toArray<A>(o: any): Array<A>;
interface Array<T> {
    pushIfNotExist(t: T): T[];
    clear(): any;
    flatten<R>(): R[];
    collect<R>(f: (t: T) => R): R[];
    flatMap<R>(f: (t: T) => R): R[];
    count(f: (t: T) => boolean): number;
    groupBy(keyer: (t: T) => number | string): jslib.Map<T[]>;
    group(size: number): Array<T[]>;
    head(): T;
    tail(): T[];
    last(): T;
}
declare function cast<A>(x: any): A;
declare function empty<A>(): A;
declare function ifVal<A>(b: boolean, t: A, f: A): A;
declare function ifFunVal<A>(b: boolean, fun: () => A, v: A, logError?: boolean): A;
declare function xor(a: any, b: any): boolean;
declare function sign(a: number): number;
declare function swap(o: any, a: any, b: string): void;
declare function getParamNames(func: any): string[];
declare module jslib {
    class Map<V> {
        private map;
        constructor(initMap?: string | any);
        toString(): string;
        add(key: string | number, value: V): Map<V>;
        set(key: string | number, value: V): Map<V>;
        remove(key: string | number): Map<V>;
        get(key: string | number): any;
        keys(): (string | number)[];
        values(): any[];
        forEach(f: (key: string | number, value: V) => void): void;
        clear(): void;
        size(): number;
    }
}
declare function object_constructor(raw: any): void;
declare function parseOrRaw(o: any | string): any;
declare module UID {
    const defaultScope: {
        lastId: number;
    };
    function Next(scope?: {
        lastId: number;
    }): number;
    function createScope(): {
        lastId: number;
    };
}
declare function copyCatConstructor(__this: any, args: IArguments): void;
declare function forloop(n: number): ((f: (i: number) => void) => void);
declare function getImageSize(url: string, callback: (width: number, height: number, isLandscape: boolean) => void): void;
