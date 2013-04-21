all:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
full:
	make demo
	make site
	make release
	make
clean:
	rm docs/api/*
	rm docs/demos/*
	rm docs/overview/*
	rm docs/index.html
b:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 0 | uglifyjs -b -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
demo:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 1 TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.demo.min.js
	make common
	./makedocs.sh
test:
	./replacevars.pl chromoselector.js | ./replacecode.pl DEMO 0 TESTSUITE 1 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
common:
	yui-compressor chromoselector.css > chromoselector.temp.css
	cat ./license.txt ./chromoselector.temp.css > chromoselector.min.css
	rm -f ./chromoselector.temp.*
release:
	rm -rf release
	make all
	./makedocs.sh RELEASE #FIXME: this is being run twice, no biggie though
	mkdir release
	cp -R docs release
	cp chromoselector.* release
	./replacecode.pl chromoselector.js DEMO 0 TESTSUITE 0 > release/chromoselector.js
	cp jquery-1.9.1.min.js release
	cp hello-world.html release
	cp license-full.txt release/LICENSE.txt
	cp README.txt release/README.txt
	cp CHANGELOG.txt release/CHANGELOG.txt
	rm release/chromoselector.js
	rm release/chromoselector.demo.min.js
	rm release/docs/overview/purchase.html
	rm release/chromoselector.min.css
site:
	rm -rf site
	make all
	./makedocs.sh SITE #FIXME: this is being run twice, no biggie though
	mkdir site
	mkdir site/libs
	cp -R docs/* site
	cp -R jquery-ui site/libs
	cp *.css site/libs
	cp chromoselector.demo.min.js site/libs
	cp copyright-notice.js site/libs
	cp jquery-1.9.1.min.js site/libs
	cp .htaccess site

.PHONY: test release site
