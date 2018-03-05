all:
	make js
	./replacevars.pl chromoselector.built.js | ./replacecode.pl TESTSUITE 0 | uglifyjs -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
js:
	wget -q -O chromoselector.built.js http://localhost/chromoselector/chromoselector/chromoselector.js
full:
	make release
	make
clean:
	rm docs/api/*
	rm docs/demos/*
	rm docs/overview/*
	rm docs/index.html
b:
	make js
	./replacevars.pl chromoselector.built.js | ./replacecode.pl TESTSUITE 0 | uglifyjs -b -nc > chromoselector.temp.js
	cat ./license.txt ./chromoselector.temp.js > chromoselector.min.js
	make common
	./makedocs.sh
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
release:
	rm -rf release
	make all
	./makedocs.sh RELEASE #FIXME: this is being run twice, no biggie though
	mkdir release
	cp -R docs release
	cp chromoselector.* release
	make js
	cp jquery-1.10.2.min.js release
	cp hello-world.html release
	cp license-full.txt release/LICENSE.txt
	cp README.txt release/README.txt
	cp CHANGELOG.txt release/CHANGELOG.txt
	rm release/chromoselector.js
	rm release/docs/overview/purchase.html
	rm release/chromoselector.min.css

.PHONY: test release
