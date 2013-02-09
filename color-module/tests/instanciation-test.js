module("Instanciation");
test("Instanciation test", function() {
	var color = new Color();
    deepEqual(color.getRgb(),  {r:0, g:0, b:0}, 'RGB is black');
    deepEqual(color.getRgba(), {r:0, g:0, b:0, a:1}, 'RGBA is black');
    deepEqual(color.getHsl(),  {h:0, s:0, l:0}, 'HSL is black');
    deepEqual(color.getHsla(), {h:0, s:0, l:0, a:1}, 'HSLA is black');
    deepEqual(color.getCmyk(), {c:0, m:0, y:0, k:1}, 'CMYK is black');
    equal(color.getRgbString(), 'rgb(0,0,0)', 'RGB string is black');
    equal(color.getRgbaString(), 'rgba(0,0,0,1)', 'RGBA string is black');
    equal(color.getHslString(), 'hsl(0,0%,0%)', 'HSL string is black');
    equal(color.getHslaString(), 'hsla(0,0%,0%,1)', 'HSLA string is black');
    equal(color.getCmykString(), 'device-cmyk(0,0,0,1)', 'CMYK string is black');
    equal(color.getHexString(), '#000000', 'HEX string is black');
    equal(color.getHexaString(), '#000000ff', 'HEXA string is black');
});