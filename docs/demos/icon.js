$(function () {
    $('#icon #color1').chromoselector({
        icon: '../libs/images/palette.png'
    });
    $('#icon #color2').chromoselector({
        icon: '../libs/images/palette.png',
        iconpos: 'left'
    });
    $('#icon').bind('updatelayout', function () {
        $(this).find('#color1, #color2').chromoselector('reflow');
    });
    $('#icon form > div > .ui-collapsible-content').css('padding', '10px 55px');
});
