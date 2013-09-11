#!/bin/bash

echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
echo "<url><loc>http://chromoselector.com/</loc></url>"

find site -name "*.html" | \
sed 's/^site/<url><loc>http:\/\/chromoselector.com/g' | \
sed 's/html$/html<\/loc><\/url>/g' | \
grep -v index

echo "</urlset>"