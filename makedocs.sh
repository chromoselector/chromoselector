#!/bin/bash

ARGS="?RELEASE=0&SITE=0"
if [ "$1" == "RELEASE" ]; then
  ARGS="?RELEASE=1&SITE=0"
elif [ "$1" == "SITE" ]; then
  ARGS="?RELEASE=0&SITE=1"
fi

rm -rf docs/libs/
mkdir docs/libs
cp -R docs-src/libs/* docs/libs/
rm docs/screenshots/*
cp -R docs-src/screenshots/* docs/screenshots/

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
cp docs-src/api/*.png docs/api/
list=$(cd docs-src/demos && ls *.html);
for file in $list; do
  wget -q -O docs/demos/$file http://localhost/chromoselector/docs-src/demos/$file$ARGS;
done

rm -f docs/overview/*.html
list=$(cd docs-src/overview && ls *.html);
for file in $list; do
  wget -q -O docs/overview/$file http://localhost/chromoselector/docs-src/overview/$file$ARGS;
done
