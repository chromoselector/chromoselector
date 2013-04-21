$(document).ready(function () {
    $('#icon #color1').chromoselector({
        icon: '../libs/images/palette.png'
    });
    $('#icon #color2').chromoselector({
        icon: '../libs/images/palette.png',
        iconpos: 'left'
    });
    $('#icon').bind('updatelayout', function () {
        $(this).find('input').chromoselector('reflow');
    });
});
