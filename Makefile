all:
	uglifyjs chromoselector.js > chromoselector.min.js
	yui-compressor chromoselector.css > chromoselector.min.css
	./makedocs.sh
b:
	uglifyjs -b chromoselector.js > chromoselector.min.js
	yui-compressor chromoselector.css > chromoselector.min.css
	./makedocs.sh
