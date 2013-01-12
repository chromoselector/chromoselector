all:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
b:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 0 | uglifyjs -b -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
demo:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 1 TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.demo.min.js
	make common
test:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 1 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
common:
	yui-compressor chromoselector.css > chromoselector.temp.css
	cat ./license.txt ./chromoselector.temp.css > chromoselector.min.css
	rm -f ./chromoselector.temp.*
	./makedocs.sh

release:
	rm -rf release
	make all
	mkdir release
	cp -R docs release
	cp chromoselector.* release
	./replacecode.pl chromoselector.js DEMO 0 TESTSUITE 0 > release/chromoselector.js
	cp jquery-1.8.3.min.js release
	cp hello-world.html release
	cp license-full.txt release/license.txt
	rm release/chromoselector.js

.PHONY: test release
