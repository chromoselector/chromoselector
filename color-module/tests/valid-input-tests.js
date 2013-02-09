module("Malformed, valid, input");
test("Set HEX string with whitespace", function () {
	var color = new Color('  #123456  ');
    equal(color.getHexString(), '#123456');
});

test("Set RGB string with extra whitespace", function () {
	var color = new Color('rgb(12,34,56)  ');
    equal(color.getRgbString(), 'rgb(12,34,56)');

	color = new Color('  rgb(12,34,56)');
    equal(color.getRgbString(), 'rgb(12,34,56)');

	color = new Color('rgb ( 12 , 34 , 56 )');
    equal(color.getRgbString(), 'rgb(12,34,56)');
});
test("Set RGBA string with extra whitespace", function () {
	var color = new Color('rgba(12,34,56,.5)  ');
    equal(color.getRgbaString(), 'rgba(12,34,56,0.5)');

	color = new Color('  rgba(12,34,56,.5)');
    equal(color.getRgbaString(), 'rgba(12,34,56,0.5)');

	color = new Color('rgba ( 12 , 34 , 56 ,.5)');
    equal(color.getRgbaString(), 'rgba(12,34,56,0.5)');
});

test("Set HSL string with extra whitespace", function () {
	var color = new Color('hsl(12,34%,56%)  ');
    equal(color.getHslString(), 'hsl(12,34%,56%)');

	color = new Color('  hsl(12,34%,56%)');
    equal(color.getHslString(), 'hsl(12,34%,56%)');

	color = new Color('hsl ( 12 , 34% , 56% )');
    equal(color.getHslString(), 'hsl(12,34%,56%)');
});
test("Set HSLA string with extra whitespace", function () {
	var color = new Color('hsla(12,34%,56%,.5)  ');
    equal(color.getHslaString(), 'hsla(12,34%,56%,0.5)');

	color = new Color('  hsla(12,34%,56%,.5)');
    equal(color.getHslaString(), 'hsla(12,34%,56%,0.5)');

	color = new Color('hsla ( 12 , 34% , 56% , .5)');
    equal(color.getHslaString(), 'hsla(12,34%,56%,0.5)');
});

test("Set CMYK string with extra whitespace", function () {
	var color = new Color('device-cmyk(0,.25,.5,.81)  ');
    equal(color.getCmykString(), 'device-cmyk(0,0.25,0.5,0.81)');

	color = new Color('  device-cmyk(0,.25,.5,.81)');
    equal(color.getCmykString(), 'device-cmyk(0,0.25,0.5,0.81)');

	color = new Color('device-cmyk ( 0 , .25 , .5 , .81 )');
    equal(color.getCmykString(), 'device-cmyk(0,0.25,0.5,0.81)');
});


test("Set RGB string object", function () {
	var color = new Color({
		r: "0.1",
		g: "0.2",
		b: "0.3"
	});
	deepEqual(color.getRgb(), { r:.1, g:.2, b:.3 });
	color = new Color({
		r: ".1",
		g: ".2",
		b: ".3"
	});
	deepEqual(color.getRgb(), { r:.1, g:.2, b:.3 });
});
test("Set RGBA string object", function () {
	var color = new Color({
		r: "0.1",
		g: "0.2",
		b: "0.3",
		a: "0.4"
	});
	deepEqual(color.getRgba(), { r:.1, g:.2, b:.3, a:.4 });
	color = new Color({
		r: ".1",
		g: ".2",
		b: ".3",
		a: ".4"
	});
	deepEqual(color.getRgba(), { r:.1, g:.2, b:.3, a:.4 });
});

test("Set HSL string object", function () {
	var color = new Color({
		h: "0",
		s: "1",
		l: "0.34"
	});
	deepEqual(color.getHsl(), { h:0, s:1, l:.34 });
	color = new Color({
		h: "0",
		s: "1",
		l: ".34"
	});
	deepEqual(color.getHsl(), { h:0, s:1, l:.34 });
});
test("Set HSLA string object", function () {
	var color = new Color({
		h: "0",
		s: "1",
		l: "0.34",
		a: "0.45"
	});
	deepEqual(color.getHsla(), { h:0, s:1, l:.34, a:.45 });
	color = new Color({
		h: "0",
		s: "1",
		l: ".34",
		a: ".45"
	});
	deepEqual(color.getHsla(), { h:0, s:1, l:.34, a:.45 });
});