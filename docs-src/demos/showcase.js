$(document).ready(function () {
    $('#showcase #showcase1').chromoselector();

    $('#showcase #showcase2').chromoselector({
        width: 130,
        panelAlpha: true,
        resizable: false,
        color2str: function (color) {
            return color.getRgbaString();
        }
    });

    $('#showcase #showcase3').chromoselector({
        panelAlpha: true,
        panel: true,
        color2str: function (color) {
            return color.getHslaString();
        }
    });

    var updatePreview = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.getHexString(),
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        });
    };

    $('#showcase #showcase4').chromoselector({
        width: 260,
        resizable: false,
        panel: true,
        panelMode: 'cmyk',
        panelModes: [],
        preview: false,
        create: updatePreview,
        update: updatePreview,
        color2str: function (color) {
            return color.getCmykString();
        }
    });

    $('#showcase #showcase5').chromoselector({
        preview: false,
        width: 130,
        resizable: false,
        create: updatePreview,
        update: updatePreview,
        pickerClass: 'dark',
        shadowColor: 'rgba(255,255,255,0.8)'
    });

    $('#showcase').bind('updatelayout', function () {
        $(this).find('input').chromoselector('reflow');
    });
});
