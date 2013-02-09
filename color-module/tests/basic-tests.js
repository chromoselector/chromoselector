module("Basic, valid input, tests");
test("Set RGB object test", function () {
	var color = new Color({
		r: 12 / 255,
		g: 34 / 255,
		b: 56 / 255
	});
    equal(color.getRgbString(), 'rgb(12,34,56)', 'RGB string matches input object');
    equal(color.getRgbaString(), 'rgba(12,34,56,1)', 'RGBA string matches input object');
});
test("Set RGBA object test", function () {
	var color = new Color({
		r: 12 / 255,
		g: 34 / 255,
		b: 56 / 255,
		a: 0.67
	});
    equal(color.getRgbString(), 'rgb(12,34,56)', 'RGB string matches input object');
    equal(color.getRgbaString(), 'rgba(12,34,56,0.67)', 'RGBA string matches input object');
});
test("Set HSL object test", function () {
	var color = new Color({
		h: 0.1,
		s: 0.23,
		l: 0.34
	});
    equal(color.getHslString(), 'hsl(36,23%,34%)', 'HSL string matches input object');
    equal(color.getHslaString(), 'hsla(36,23%,34%,1)', 'HSLA string matches input object');
});
test("Set HSLA object test", function () {
	var color = new Color({
		h: 0.1,
		s: 0.23,
		l: 0.34,
		a: 0.45
	});
    equal(color.getHslString(), 'hsl(36,23%,34%)', 'HSL string matches input object');
    equal(color.getHslaString(), 'hsla(36,23%,34%,0.45)', 'HSLA string matches input object');
});
test("Set CMYK object test", function () {
	var color = new Color({
		c: 0,
		m: .25,
		y: .5,
		k: .81
	});
    equal(color.getCmykString(), 'device-cmyk(0,0.25,0.5,0.81)', 'CMYK string matches input object');
});

test("Set RGB string test", function () {
	var color = new Color('rgb(12,34,56)');
    deepEqual(
    	color.getRgb(),
    	{
			r: 12 / 255,
			g: 34 / 255,
			b: 56 / 255
		},
		'RGB object matches input string'
	);
    deepEqual(
    	color.getRgba(),
    	{
			r: 12 / 255,
			g: 34 / 255,
			b: 56 / 255,
			a: 1
		},
    	'RGBA object matches input string'
    );
});
test("Set RGBA string test", function () {
	var color = new Color('rgba(12,34,56,0.33)');
    deepEqual(
    	color.getRgb(),
    	{
			r: 12 / 255,
			g: 34 / 255,
			b: 56 / 255
		},
		'RGB string matches input object'
	);
    deepEqual(
    	color.getRgba(),
    	{
			r: 12 / 255,
			g: 34 / 255,
			b: 56 / 255,
			a: 0.33
		},
    	'RGBA string matches input object'
    );
});

test("Set RGB string test", function () {
	var color = new Color('rgb(20%,30%,40%)');
    deepEqual(
    	color.getRgb(),
    	{
			r: .2,
			g: .3,
			b: .4
		},
		'RGB object matches input string'
	);
    deepEqual(
    	color.getRgba(),
    	{
			r: .2,
			g: .3,
			b: .4,
			a: 1
		},
    	'RGBA object matches input string'
    );
});
test("Set RGBA string test", function () {
	var color = new Color('rgba(20%,30%,40%,0.33)');
    deepEqual(
    	color.getRgb(),
    	{
			r: .2,
			g: .3,
			b: .4
		},
		'RGB string matches input object'
	);
    deepEqual(
    	color.getRgba(),
    	{
			r: .2,
			g: .3,
			b: .4,
			a: 0.33
		},
    	'RGBA string matches input object'
    );
});


test("Set HSL string test", function () {
	var color = new Color('hsl(36,20%,34%)');
    deepEqual(
    	color.getHsl(),
    	{
			h: 0.1,
			s: 0.2,
			l: 0.34
		},
		'HSL object matches input string'
	);
    deepEqual(
    	color.getHsla(),
    	{
			h: 0.1,
			s: 0.2,
			l: 0.34,
			a: 1
		},
    	'HSLA object matches input string'
    );
});
test("Set HSLA string test", function () {
	var color = new Color('hsla(72,33%,34%,0.45)');
    deepEqual(
    	color.getHsl(),
    	{
			h: 0.2,
			s: 0.33,
			l: 0.34
		},
		'HSL object matches input string'
	);
    deepEqual(
    	color.getHsla(),
    	{
			h: 0.2,
			s: 0.33,
			l: 0.34,
			a: 0.45
		},
    	'HSLA object matches input string'
    );
});
test("Set HSLA string test", function () {
	var color = new Color('hsla(56,77%,34%,.45)');
    deepEqual(
    	color.getHsl(),
    	{
			h: 56/360,
			s: 0.77,
			l: 0.34
		},
		'HSL object matches input string'
	);
    deepEqual(
    	color.getHsla(),
    	{
			h: 56/360,
			s: 0.77,
			l: 0.34,
			a: 0.45
		},
    	'HSLA object matches input string'
    );
});

test("Set CMYK string test", function () {
	var color = new Color('device-cmyk(0,0.25,0.5,0.81)');
    deepEqual(
    	color.getCmyk(),
    	{
			c: 0,
			m: .25,
			y: .5,
			k: .81
		},
		'CMYK object matches input string'
	);
});
test("Set CMYK string test", function () {
	var color = new Color('device-cmyk(0,.25,.5,.81)');
    deepEqual(
    	color.getCmyk(),
    	{
			c: 0,
			m: .25,
			y: .5,
			k: .81
		},
		'CMYK object matches input string'
	);
});

test("Set HEX string test", function () {
	var color = new Color('#123456');
    deepEqual(
    	color.getRgb(),
    	{
			r: parseInt('0x12', 16) / 255,
			g: parseInt('0x34', 16) / 255,
			b: parseInt('0x56', 16) / 255
		},
		'RGB object matches HEX string'
	);
});

test("Set shortnhand HEX string test", function () {
	var color = new Color('#123');
    deepEqual(
    	color.getRgb(),
    	{
			r: parseInt('0x11', 16) / 255,
			g: parseInt('0x22', 16) / 255,
			b: parseInt('0x33', 16) / 255
		},
		'RGB object matches HEX string'
	);
});

test("Set HEXA string test", function () {
	var color = new Color('#12345678');
    deepEqual(
    	color.getRgba(),
    	{
			r: parseInt('0x12', 16) / 255,
			g: parseInt('0x34', 16) / 255,
			b: parseInt('0x56', 16) / 255,
			a: parseInt('0x78', 16) / 255
		},
		'RGB object matches HEX string'
	);
});

test("Set shortnhand HEXA string test", function () {
	var color = new Color('#1234');
    deepEqual(
    	color.getRgba(),
    	{
			r: parseInt('0x11', 16) / 255,
			g: parseInt('0x22', 16) / 255,
			b: parseInt('0x33', 16) / 255,
			a: parseInt('0x44', 16) / 255
		},
		'RGB object matches HEX string'
	);
});