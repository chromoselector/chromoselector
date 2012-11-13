$(function () {
    $('#basic1').chromoselector();

    var updatePreview = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.hex,
            'color': color.getTextColor().hex,
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().hex
        });
    };

    $('#basic2').chromoselector({
        target: '#picker',
        autoshow: false,
        create: function () {
            updatePreview.call(this);
            $(this).chromoselector('show', 0);
        },
        width: 260,
        update: updatePreview
    });
    $('#picker').find('.ui-cs-container').removeClass('ui-cs-container');
    $('#picker').parent().append('<div style="clear: both;"></div>');


    $(document).bind('updatelayout', function () {
        $(this)
            .find('#basic1')
            .chromoselector('reflow');
    });
});
