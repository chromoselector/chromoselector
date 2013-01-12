$(document).ready(function () {

    $('#inline').chromoselector({
        preview: true
    });

    $('#no_preview').chromoselector({
        preview: false
    });

    var updatePreview = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.hex,
            'color': color.getTextColor().hex,
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().hex
        });
    };
    $('#textfield').chromoselector({
        preview: false,
        create: updatePreview,
        update: updatePreview
    });

    $(document).bind('updatelayout', function () {
        $(this)
            .find('#inline, #no_preview')
            .chromoselector('reflow');
    });
});
