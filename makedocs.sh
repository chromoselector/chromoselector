#!/bin/bash

rm -rf docs/libs/
mkdir docs/libs
cp -R docs-src/libs/* docs/libs/


rm -f docs/*.html
wget -q -O docs/index.html http://localhost/chromoselector/docs-src/index.html

rm -f docs/api/*.html
list=$(cd docs-src/api && ls *.html);
for file in $list; do
  wget -q -O docs/api/$file http://localhost/chromoselector/docs-src/api/$file;
done

rm -f docs/demos/*
cp docs-src/demos/*.js docs/demos/
cp docs-src/demos/*.jpg docs/demos/
list=$(cd docs-src/demos && ls *.html);
for file in $list; do
  wget -q -O docs/demos/$file http://localhost/chromoselector/docs-src/demos/$file;
done

rm -f docs/overview/*.html
list=$(cd docs-src/overview && ls *.html);
for file in $list; do
  wget -q -O docs/overview/$file http://localhost/chromoselector/docs-src/overview/$file;
done
