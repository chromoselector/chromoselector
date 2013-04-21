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
