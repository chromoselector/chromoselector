all:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./licence.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
b:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 0 | uglifyjs -b -nc > chromoselector.temp.js
	cat ./licence.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
demo:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 1 TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./licence.txt ./chromoselector.temp.js > chromoselector.demo.min.js
	make common
test:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 1 | uglifyjs -nc > chromoselector.temp.js
	cat ./licence.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
common:
	yui-compressor chromoselector.css > chromoselector.temp.css
	cat ./licence.txt ./chromoselector.temp.css > chromoselector.min.css
	rm -f ./chromoselector.temp.*
	./makedocs.sh
