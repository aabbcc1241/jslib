# jslib
utils library, consist of three parts : es5, es6, style

## remark
~~no need to include es5 version if you're using es6 version (it is bundled)~~
 - for typescript project (consumer), include the src code directly, don't include the dist
 - the project (consumer) should add the required typings on their own (to avoid duplicated declare)

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

## test
this is quick test (frequently used during developement, there it doesn't not install)
```
./test.sh
```

## dependency
this must be satisfied by the consumer
browser => include / inject into DOM / eval in runtime
library => include for build but ignore in dist

1. [isomorphic-fetch] (https://github.com/matthew-andrews/isomorphic-fetch)
