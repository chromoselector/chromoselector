// animations
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

// custom color format
$(document).ready(function () {
    $('#color0').chromoselector();

    $('#color1').chromoselector({
        color2str: function (color) {
            return color.getRgbString();
        }
     });

    $('#color2').chromoselector({
        panelAlpha: true,
        color2str: function (color) {
            return color.getRgbaString();
        }
     });

    $('#color3').chromoselector({
        color2str: function (color) {
            return color.getHslString();
        }
    });

    $('#color4').chromoselector({
        panelAlpha: true,
        color2str: function (color) {
            return color.getHslaString();
        }
    });

    $('#color5').chromoselector({
        str2color: function (str) {
            return '#' + str;
        },
        color2str: function (color) {
            return color.getHexString().substring(1);
        }
    });

    $('#color6').chromoselector({
        str2color: function (str) {
            try {
                return $.parseJSON(str);
            } catch (e) {}
        },
        color2str: function (color) {
            var cmyk = color.getCmyk();
            for (var i in cmyk) {
                cmyk[i] = Math.round(cmyk[i] * 100) / 100;
            }
            return JSON.stringify(cmyk);
        }
    });

    $('#color7').chromoselector({
        str2color: function (str) {
            var num = parseInt(str, 10) || 0;
            return {
                r: ((num & (255*255*255)) >> 16) / 255,
                g: ((num & (255*255)) >> 8) / 255,
                b: ((num & (255))) / 255
            };
        },
        color2str: function (color) {
            var rgb = color.getRgb();
            var num = (Math.round(rgb.r * 255) << 16)
                + (Math.round(rgb.g * 255) << 8)
                + Math.round(rgb.b * 255)
            return num;
        }
    });
});

// display modes
$(document).ready(function () {
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

// icon
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

// previews
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

// showcase
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
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        }).parent().css('background-color', color.getHexString());
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

    var updatePreview2 = function() {
        var color = $(this).chromoselector('getColor');
        $(this).css({
            'background-color': color.getHexString(),
            'color': color.getTextColor().getHexString(),
            'text-shadow': '0 1px 0 ' + color.getTextColor().getTextColor().getHexString()
        });
    };

    $('#showcase #showcase6').css({
        border: '5px ridge gray',
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        'text-indent': '25px',
        padding: 0,
        'box-shadow': 0,
        'border-radius': 0
    }).parent().css({
        'box-shadow':'0 0 0 transparent',
        'border-radius':0,
        'border':0
    }).end().chromoselector({
        create: updatePreview2,
        update: updatePreview2,
        preview: false,
        roundcorners: false
    });

    $('#showcase').bind('updatelayout', function () {
        $(this).find('input').chromoselector('reflow');
    });
});
