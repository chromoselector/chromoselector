all:
	./replacevars.pl chromoselector.js | uglifyjs -nc > chromoselector.temp.js
	cat ./licence.txt ./chromoselector.temp.js > chromoselector.min.js
	rm -f ./chromoselector.temp.js
	yui-compressor chromoselector.css > chromoselector.min.css
	./makedocs.sh
b:
	./replacevars.pl chromoselector.js | uglifyjs -b -nc > chromoselector.temp.js
	cat ./licence.txt ./chromoselector.temp.js > chromoselector.min.js
	rm -f ./chromoselector.temp.js
	yui-compressor chromoselector.css > chromoselector.min.css
	./makedocs.sh
