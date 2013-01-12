#!/bin/bash

ARGS="?RELEASE=0"
if [ ! -z $1 ]; then
  ARGS="?RELEASE=1"
fi

rm -rf docs/libs/
mkdir docs/libs
cp -R docs-src/libs/* docs/libs/

rm -f docs/*.html
wget -q -O docs/index.html http://localhost/chromoselector/docs-src/index.html$ARGS

rm -f docs/api/*.html
list=$(cd docs-src/api && ls *.html);
for file in $list; do
  wget -q -O docs/api/$file http://localhost/chromoselector/docs-src/api/$file$ARGS;
done

rm -f docs/demos/*
cp docs-src/demos/*.js docs/demos/
cp docs-src/demos/*.jpg docs/demos/
list=$(cd docs-src/demos && ls *.html);
for file in $list; do
  wget -q -O docs/demos/$file http://localhost/chromoselector/docs-src/demos/$file$ARGS;
done

rm -f docs/overview/*.html
list=$(cd docs-src/overview && ls *.html);
for file in $list; do
  wget -q -O docs/overview/$file http://localhost/chromoselector/docs-src/overview/$file$ARGS;
done
