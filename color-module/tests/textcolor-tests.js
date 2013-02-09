module("Textcolor test");
test("getTextColor test", function () {
	var color = new Color();
	equal(color.getTextColor().getHexString(), '#ffffff');

	color.setColor('#fff');
	equal(color.getTextColor().getHexString(), '#000000');	
});