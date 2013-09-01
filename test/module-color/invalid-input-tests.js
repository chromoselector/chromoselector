module("Malformed, invalid, input");
test("Setting invalid color shouldn't corrupt previous value", function () {
	var color = new Color('#123456');

	color.setColor('foobar');
    equal(color.getHexString(), '#123456');

	color.setColor('# 654987');
	equal(color.getHexString(), '#123456');

	color.setColor({ h: .2, s: .3, v: .4 });
    equal(color.getHexString(), '#123456');

    color.setColor('rgb(,,,)');
    equal(color.getHexString(), '#123456');

    color.setColor('rgb(0,0)');
    equal(color.getHexString(), '#123456');

    color.setColor('rgb(1,0,0');
    equal(color.getHexString(), '#123456');

    color.setColor('rgb(10%,10%,10%,10%)');
    equal(color.getHexString(), '#123456');

    color.setColor('rgb(%,%,%,1)');
    equal(color.getHexString(), '#123456');

    color.setColor('hsl(');
    equal(color.getHexString(), '#123456');

    color.setColor('hsla(1,2,3,4)');
    equal(color.getHexString(), '#123456');

    color.setColor('hsl(1,2,3)');
    equal(color.getHexString(), '#123456');
});