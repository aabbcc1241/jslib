# jslib
utils library, consist of three parts : es5, es6, style

## remark
no need to include es5 version if you're using es6 version (it is bundled)

## utils functions

## Horizon stub (Rethinkdb middleware) [http://horizon.io/#1.0-release]
- horizon.d.ts
- horizon-param.ts

# polyfill
 - Array
    - pushIfNotExist
    - clear
    - flatten
    - collect
    - flatMap
    - count
    - groupBy
    - group
    - head
    - tail
    - last
 - HTMLCollection
    - toArray
 - HTMLElement
    - findParent

## installation steps
1. git clone https://github.com/beenotung/jslib.git # or use as submodule
2. cd jslib
3. ./build.sh
or
```
npm install && npm build
```
