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
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        }).parent().css('background-color', color.getHexString());
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
