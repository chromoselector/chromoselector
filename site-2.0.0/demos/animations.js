$(document).ready(function () {

    $('#fade').chromoselector({
        effect: 'fade'
    });

    $('#slide').chromoselector({
        effect: 'slide'
    });

    $(document).bind('updatelayout', function () {
        $(this)
            .find('#fade, #slide')
            .chromoselector('reflow');
    });
});
