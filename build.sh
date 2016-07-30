#!/usr/bin/env bash

#npm install && npm run build # deprecated

cd es5 && npm install && npm run build && cd ..
cd es6 && npm install && npm run build && cd ..
