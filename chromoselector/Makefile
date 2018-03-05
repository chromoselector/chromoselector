all:
	make js
	./replacevars.pl chromoselector.built.js | ./replacecode.pl TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
js:
	wget -q -O chromoselector.built.js http://localhost/chromoselector/chromoselector/chromoselector.js
clean:
	rm docs/api/*
	rm docs/demos/*
	rm docs/overview/*
	rm docs/index.html
test:
	make js
	./replacevars.pl chromoselector.built.js | ./replacecode.pl TESTSUITE 1 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
common:
	yui-compressor chromoselector.css > chromoselector.temp.css
	cat ./license.txt ./chromoselector.temp.css > chromoselector.min.css
	rm -f ./chromoselector.temp.*
	rm -f ./chromoselector.built.js

.PHONY: test
