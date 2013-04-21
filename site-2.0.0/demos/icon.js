$(document).ready(function () {
    $('#icon #icon1').chromoselector({
        icon: '../libs/images/palette.png'
    });
    $('#icon #icon2').chromoselector({
        icon: '../libs/images/palette.png',
        iconpos: 'left'
    });
    $('#icon').bind('updatelayout', function () {
        $(this).find('input').chromoselector('reflow');
    });
});
