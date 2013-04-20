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
        width: 130,
        resizable: false,
        pickerClass: 'dark',
        shadowColor: 'rgba(255,255,255,0.8)'
    });

    $('#showcase #showcase6').css({
        border: '5px ridge gray',
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        'text-indent': '25px',
        padding: 0,
        'box-shadow': 0,
        'border-radius': 0
    }).chromoselector({
        create: updatePreview,
        update: updatePreview,
        preview: false,
        roundcorners: false
    });

    $('#showcase').bind('updatelayout', function () {
        $(this).find('input').chromoselector('reflow');
    });
});
