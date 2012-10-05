all:
	uglifyjs --define TESTSUITE=false color-picker.js > color-picker.min.js
