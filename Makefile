all:
	make js
	cat chromoselector.built.js | uglifyjs -nc > chromoselector.temp.js
	cat ./LICENSE.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
js:
	wget -q -O chromoselector.built.js http://localhost/chromoselector/chromoselector/chromoselector.js
common:
	yui-compressor chromoselector.css > chromoselector.temp.css
	cat ./LICENSE.txt ./chromoselector.temp.css > chromoselector.min.css
	rm -f ./chromoselector.temp.*
	rm -f ./chromoselector.built.js

.PHONY: test
