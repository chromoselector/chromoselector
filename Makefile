all:
	uglifyjs --define TESTSUITE=false color-picker.js > color-picker.min.js

b:
	uglifyjs -b --define TESTSUITE=false color-picker.js > color-picker.min.js
