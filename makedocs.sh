#!/bin/bash

rm -f docs/*.html
wget -O docs/index.html http://localhost/chromoselector/docs-src/index.html

rm -f docs/api/*.html
list=$(cd docs-src/api && ls *.html);
for file in $list; do
  wget -O docs/api/$file http://localhost/chromoselector/docs-src/api/$file;
done

rm -f docs/demos/*.html
list=$(cd docs-src/demos && ls *.html);
for file in $list; do
  wget -O docs/demos/$file http://localhost/chromoselector/docs-src/demos/$file;
done

rm -f docs/overview/*.html
list=$(cd docs-src/overview && ls *.html);
for file in $list; do
  wget -O docs/overview/$file http://localhost/chromoselector/docs-src/overview/$file;
done
