$(function () {
    $('#basic1').chromoselector();

    $('#basic2').chromoselector({
        target: '#picker',
        autoshow: false,
        create: function () {
            $(this).chromoselector('show', 0);
        },
        width: 260
    });
    $('#picker').parent().append('<div style="clear: both;"></div>');


    $(document).bind('updatelayout', function () {
        $(this)
            .find('#basic1')
            .chromoselector('reflow');
    });
});
