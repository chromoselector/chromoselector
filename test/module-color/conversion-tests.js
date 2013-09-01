module("Conversion tests");

var Colors = [
	{
		HexString: '#000000',
		HexaString: '#000000ff',
		RgbString: 'rgb(0,0,0)',
		RgbaString: 'rgba(0,0,0,1)',
		HslString: 'hsl(0,0,0)',
		HslaString: 'hsl(0,0,0,1)',
		CmykString: 'device-cmyk(0,0,0,1)',
		Rgb: {
			r: 0,
			g: 0,
			b: 0
		},
		Rgba: {
			r: 0,
			g: 0,
			b: 0,
			a: 1
		},
		Hsl: {
			h: 0,
			s: 0,
			l: 0
		},
		Hsla: {
			h: 0,
			s: 0,
			l: 0,
			a: 1
		},
		Cmyk: {
			c: 0,
			m: 0,
			y: 0,
			k: 1
		}
	}
];


/*
test("Set RGB object test", function () {
	var color = new Color();
	for (var i in Colors) {
		for (var j in Colors[i]) {
			for (var k in Colors[i]) {
				deepEqual(
					color.setColor(Colors[i][j])[k](),
					Colors[i][j]
				);
			}
		}
	}
 
});*/