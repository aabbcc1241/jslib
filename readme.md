# jslib (deprecated)
utils library, consist of three parts : es5, es6, style

## Deprecated
This project might not be updated any more due to the lack of interest on Javascript the language.
However, two repo are 'devirved' from this repo: [tslib](https://github.com/beenotung/tslib) and [scsslib](https://github.com/beenotung/scsslib). The new repos will not focus on packing the lib for non ts or non scss environment to make things more simple, consistant and typesafe.

## Remark
~~no need to include es5 version if you're using es6 version (it is bundled)~~
 - for typescript project (consumer), include the src code directly, don't include the dist
 - the project (consumer) should add the required typings on their own (to avoid duplicated declare)

## Utils Functions

## Horizon Stub (Rethinkdb middleware) [http://horizon.io/#1.0-release]
- horizon.d.ts
- horizon-param.ts

# Polyfill
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

## Installation Steps
1. git clone https://github.com/beenotung/jslib.git # or use as submodule
2. cd jslib
3. ./build.sh
or
```
npm install && npm build
```

## Test
this is quick test (frequently used during developement, there it doesn't not install)
```
./test.sh
```

## Dependency
this must be satisfied by the consumer
browser => include / inject into DOM / eval in runtime
library => include for build but ignore in dist

1. [isomorphic-fetch] (https://github.com/matthew-andrews/isomorphic-fetch)
