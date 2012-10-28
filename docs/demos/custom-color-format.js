$(document).bind('pageinit', function () {
    $('#custom-color-format #color2').chromoselector({
        str2color: function (str) {
            var arr = str.split(',');
            return {
                h: parseInt(arr[0], 10) / 360,
                s: parseInt(arr[1], 10) / 100,
                l: parseInt(arr[2], 10) / 100
            };
        },
        color2str: function (color) {
            return Math.round(color.hsl.h * 360) + ',' +
                   Math.round(color.hsl.s * 100) + ',' +
                   Math.round(color.hsl.l * 100);
        }
    });
    $('#custom-color-format #color3').chromoselector({
        str2color: function (str) {
            try {
                var color = $.parseJSON(str);
                for (var i in color) {
                    color[i] /= 100;
                }
                return color;
            } catch (e) {}
        },
        color2str: function (color) {
            return '{' +
            '"c":' + Math.round(color.cmyk.c * 100) + ',' +
            '"m":' + Math.round(color.cmyk.m * 100) + ',' +
            '"y":' + Math.round(color.cmyk.y * 100) + ',' +
            '"k":' + Math.round(color.cmyk.k * 100) +
            '}';
        }
    });
    $('#custom-color-format #color1').chromoselector({
        str2color: function (str) {
            return '#' + str;
        },
        color2str: function (color) {
            return color.hex.substring(1);
        }
    });
    $('#custom-color-format #color4').chromoselector({
        str2color: function (str) {
            var num = parseInt(str, 10) || 0;
            return {
                r: ((num & (255*255*255)) >> 16) / 255,
                g: ((num & (255*255)) >> 8) / 255,
                b: ((num & (255))) / 255
            };
        },
        color2str: function (color) {
            var num = (Math.round(color.rgb.r * 255) << 16)
                + (Math.round(color.rgb.g * 255) << 8)
                + Math.round(color.rgb.b * 255)
            return num;
        }
    });
});
