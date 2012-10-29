$(document).bind('pageinit', function () {
    $('#icon #color1').chromoselector({
        icon: '../libs/images/palette.png'
    });
    $('#icon #color2').chromoselector({
        icon: '../libs/images/palette.png',
        iconPos: 'left'
    });
    $('#icon').bind('updatelayout', function () {
        $(this).find('#color1, #color2').chromoselector('reflow');
    });
    $('#icon form > div > .ui-collapsible-content').css('padding', '10px 55px');
}).bind('pageshow', function () {
    $('#icon #color1, #icon #color2').each(function () {
        if ($(this).data('chromoselector')) {
            $(this).chromoselector('reflow');
        }
    });
});
