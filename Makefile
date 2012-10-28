all:
	uglifyjs --define TESTSUITE=false chromoselector.js > chromoselector.min.js
	cat chromoselector.js | sed 's/\.settings/.s/g' | \
		    sed 's/\._container/.a/g' | \
			   sed 's/\._target/.b/g' | \
			   sed 's/\._picker/.c/g' | \
		 	   sed 's/\._source/.d/g' | \
		 		 sed 's/\._icon/.e/g' | \
			  sed 's/\.settings/.f/g' | \
		   sed 's/\.draggingHue/.g/g' | \
		sed 's/\.draggingSatLum/.h/g' | \
		  sed 's/\.resizeOffset/.i/g' | \
		  sed 's/\.resizingBusy/.i/g' | \
		 sed 's/\.resizingSaved/.j/g' | \
			   sed 's/\.drawing/.k/g' | \
			  sed 's/\.diameter/.l/g' | \
			sed 's/\.widthRatio/.m/g' | \
		   sed 's/\.shadowRatio/.n/g' | \
		sed 's/\.triangleRadius/.o/g' | \
			  sed 's/\.canvases/.p/g' | \
			sed 's/\.tempCanvas/.q/g' | \
				 sed 's/\.ready/.r/g' | \
	      sed 's/\.ColorWheelBg/.s/g' | \
			  sed 's/\.resizing/.t/g' \
	> color-picker.2.js
	uglifyjs -nc -b --define TESTSUITE=false chromoselector.2.js > chromoselector.2.min.js
	yui-compressor chromoselector.css > chromoselector.min.css

b:
	uglifyjs -b --define TESTSUITE=false chromoselector.js > chromoselector.min.js
