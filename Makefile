all:
	mkdir -p dist
	#wget -q -O chromoselector.built.js http://localhost/chromoselector/chromoselector/chromoselector.js
	cat ./LICENSE.txt > dist/chromoselector.min.js
	uglifyjs src/chromoselector.js >> dist/chromoselector.min.js
	cat ./LICENSE.txt > dist/chromoselector.min.css
	yui-compressor src/chromoselector.css >> dist/chromoselector.min.css