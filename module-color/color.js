/**
 * COLOR MANAGEMENT
 */
var Color = (function () {
    var round = Math.round;
    function Color(value) {
        var self = this;
        // default to black
        var currentColor = { r:0, g:0, b:0, a:1 };
        var currentHslColor = { h:0, s:0, l:0, a:1 };
        var isHsl = false;

        // Object getters
        self.getRgba = function () {
            return currentColor;
        };
        self.getRgb = function () {
            return getRgb(currentColor);
        };
        self.getHsla = function () {
            if (isHsl) {
                return currentHslColor;
            } else {
                return getHslaFromRgb(currentColor);
            }
        };
        self.getHsl = function () {
            if (isHsl) {
                return getHsl(currentHslColor);
            } else {
                return getHslFromRgb(currentColor);
            }
        };
        self.getCmyk = function () {
            return getCmyk(currentColor);
        };
        // String getters
        self.getRgbaString = function () {
            return getRgbaString(currentColor);
        };
        self.getRgbString = function () {
            return getRgbString(currentColor);
        };
        self.getHexaString = function () {
            return getHexaString(currentColor);
        };
        self.getHexString = function () {
            return getHexString(currentColor);
        };
        self.getHslaString = function () {
            return getHslaString(currentColor);
        };
        self.getHslString = function () {
            return getHslString(currentColor);
        };
        self.getCmykString = function () {
            return getCmykString(currentColor);
        };
        // Contrasting color getter
        self.getTextColor = function () {
            return getTextColor(currentColor);
        };
        // Color setter
        self.setColor = function (color) {
            var retval      = setColor(color, currentColor, currentHslColor, isHsl);
            currentColor    = retval.rgba;
            currentHslColor = retval.hsla;
            isHsl           = retval.isHsl;
            return self;
        };
        self.setAlpha = function (value) {
            value = parseFloat(value);
            if (! isNaN(value) && value >= 0 && value <= 1) {
                currentColor.a = value;
                currentHslColor.a = value;
            }
            return self;
        };
        self.getAlpha = function () {
            return currentColor.a;
        };
        // Set to input color
        self.setColor(value);
    }

    // Object getters
    function getRgb(color) {
        var retval = {};
        retval.r = color.r;
        retval.g = color.g;
        retval.b = color.b;
        return retval;
    }
    function getHslFromRgb(color) {
        var retval = {};
        var hsl = rgb2hsl(color);
        retval.h = hsl.h;
        retval.s = hsl.s;
        retval.l = hsl.l;
        return retval;
    }
    function getHsl(color) {
        var retval = {};
        retval.h = color.h;
        retval.s = color.s;
        retval.l = color.l;
        return retval;
    }
    function getHslaFromRgb(color) {
        return rgb2hsl(color);
    }
    function getCmyk(color) {
        return rgb2cmyk(color);
    }

    // String getters
    function getRgbString(color) {
        return 'rgb('
            + round(color.r * 255) + ','
            + round(color.g * 255) + ','
            + round(color.b * 255) + ')';
    }
    function getRgbaString(color) {
        return 'rgba('
            + round(color.r * 255) + ','
            + round(color.g * 255) + ','
            + round(color.b * 255) + ','
            + round(color.a * 100) / 100  + ')';
    }
    function getHexString(color) {
        return rgb2hex(color);
    }
    function getHexaString(color) {
        var byte = round(color.a * 255);
        var value = byte.toString(16);
        if (byte < 16) {
            value = "0" + value;
        }
        return rgb2hex(color) + value;
    }
    function getHslString(color) {
        var hsla = rgb2hsl(color);
        return 'hsl('
            + round(hsla.h * 360) + ','
            + round(hsla.s * 100) + '%,'
            + round(hsla.l * 100) + '%)';
    }
    function getHslaString(color) {
        var hsla = rgb2hsl(color);
        return 'hsla('
            + round(hsla.h * 360) + ','
            + round(hsla.s * 100) + '%,'
            + round(hsla.l * 100) + '%,'
            + round(hsla.a * 100) / 100  + ')';
    }
    // http://www.w3.org/TR/css3-gcpm/#cmyk-colors
    function getCmykString(color) {
        var cmyk = rgb2cmyk(color);
        return 'device-cmyk('
            + round(cmyk.c * 100) / 100 + ','
            + round(cmyk.m * 100) / 100 + ','
            + round(cmyk.y * 100) / 100 + ','
            + round(cmyk.k * 100) / 100 + ')';
    }

    // Contrasting color getter
    function getTextColor(color) {
        // See BT 709 color spec
        var luma = color.r*0.2126 + color.g*0.7152 + color.b*0.0722;
        return new Color(luma < 0.35 ? '#fff' : '#000');
    }

    // Color setter
    function setColor(value, currentColor, currentHslColor, isHsl) {
        var parts, i, alpha, hue;
        if (typeof value === 'string') {
            if (/^\s*#/.test(value)) { // hex
                if (/^\s*#([0-9a-f]{3}){1,2}\s*$/i.test(value)) {
                    value = value.replace(/\s*/, '');
                    if (value.length === 4) {
                        value = value.replace(/[0-9a-f]/gi, replaceCallback);
                    }
                    currentColor = hex2rgb(value);
                    currentColor.a = 1;
                    isHsl = false;
                } else if (/^\s*#([0-9a-f]{4}){1,2}\s*$/i.test(value)) {
                    value = value.replace(/\s*/, '');
                    if (value.length === 5) {
                        value = value.replace(/[0-9a-f]/gi, replaceCallback);
                    }
                    currentColor = hexa2rgb(value);
                    isHsl = false;
                }
            } else if (/^\s*rgba/.test(value)) {
                parts = value.match(/^\s*rgba\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\.\d+|\d+\.?\d*)\s*\)\s*$/);
                if (parts && parts.length === 5) {
                    parts.shift();
                    alpha = parts.pop() / 1; // Divide by 1 to convert string to number
                    if (alpha > 1) {
                        alpha = 1;
                    } else if (alpha < 0) {
                        alpha = 0;
                    }
                    for (i=0; i<parts.length; i++) {
                        if (parts[i].indexOf('%') !== -1) {
                            parts[i] = parts[i].substr(0, parts[i].length - 1) / 100;
                        } else {
                            parts[i] = parts[i] / 255;
                        }
                        if (parts[i] > 1) {
                            parts[i] = 1;
                        } else if (parts[i] < 0) {
                            parts[i] = 0;
                        }
                    }
                    currentColor.r = parts[0];
                    currentColor.g = parts[1];
                    currentColor.b = parts[2];
                    currentColor.a = alpha;
                    isHsl = false;
                }
            } else if (/^\s*rgb/.test(value)) {
                parts = value.match(/^\s*rgb\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*\)\s*$/);
                if (parts && parts.length === 4) {
                    parts.shift();
                    for (i=0; i<parts.length; i++) {
                        if (parts[i].indexOf('%') !== -1) {
                            parts[i] = parts[i].substr(0, parts[i].length - 1) / 100;
                        } else {
                            parts[i] = parts[i] / 255;
                        }
                        if (parts[i] > 1) {
                            parts[i] = 1;
                        } else if (parts[i] < 0) {
                            parts[i] = 0;
                        }
                    }
                    currentColor.r = parts[0];
                    currentColor.g = parts[1];
                    currentColor.b = parts[2];
                    currentColor.a = 1;
                    isHsl = false;
                }
            } else if (/^\s*hsla/.test(value)) {
                parts = value.match(/^\s*hsla\s*\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*,\s*(\.\d+|\d+\.?\d*)\s*\)\s*$/);
                if (parts && parts.length === 5) {
                    parts.shift();
                    hue = parts.shift() / 360;
                    hue = hue - Math.floor(hue);
                    if (hue < 0) {
                        hue = 1 + hue;
                    }
                    alpha = parts.pop() / 1; // Divide by 1 to convert string to number
                    if (alpha > 1) {
                        alpha = 1;
                    } else if (alpha < 0) {
                        alpha = 0;
                    }
                    if (parts.length === 2) {
                        for (i=0; i<parts.length; i++) {
                            parts[i] = parts[i].substr(0, parts[i].length - 1) / 100;
                            if (parts[i] > 1) {
                                parts[i] = 1;
                            } else if (parts[i] < 0) {
                                parts[i] = 0;
                            }
                        }
                        isHsl = true;
                        currentHslColor = {
                            h: hue,
                            s: parts[0],
                            l: parts[1],
                            a: alpha
                        };
                    }
                }
            } else if (/^\s*hsl/.test(value)) {
                parts = value.match(/^\s*hsl\s*\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)\s*$/);
                if (parts && parts.length === 4) {
                    parts.shift();
                    hue = parts.shift() / 360;
                    hue = hue - Math.floor(hue);
                    if (hue < 0) {
                        hue = 1 + hue;
                    }
                    for (i=0; i<parts.length; i++) {
                        parts[i] = parts[i].substr(0, parts[i].length - 1) / 100;
                        if (parts[i] > 1) {
                            parts[i] = 1;
                        } else if (parts[i] < 0) {
                            parts[i] = 0;
                        }
                    }
                    isHsl = true;
                    currentHslColor = {
                        h: hue,
                        s: parts[0],
                        l: parts[1],
                        a: 1
                    };
                }
            } else if (/^\s*device-cmyk/.test(value)) {
                parts = value.match(/^\s*device-cmyk\s*\(\s*(\.\d+|\d+\.?\d*)\s*,\s*(\.\d+|\d+\.?\d*)\s*,\s*(\.\d+|\d+\.?\d*)\s*,\s*(\.\d+|\d+\.?\d*)\s*\)\s*$/);
                if (parts && parts.length === 5) {
                    parts.shift();
                    for (i=0; i<parts.length; i++) {
                        parts[i] = parts[i] / 1; // Divide by 1 to convert string to number
                        if (parts[i] > 1) {
                            parts[i] = 1;
                        } else if (parts[i] < 0) {
                            parts[i] = 0;
                        }
                    }
                    currentColor = cmyk2rgb({
                        c: parts[0],
                        m: parts[1],
                        y: parts[2],
                        k: parts[3]
                    });
                    isHsl = false;
                }
            }
        } else if (value instanceof Color) {
            var color = value.getRgba();
            if (haveFields(value, 'rgba')) {
                currentColor = color;
                isHsl = false;
            }
        } else if (typeof value === 'object') {
            for (i in value) {
                value[i] = parseFloat(value[i]);
            }
            if (haveFields(value, 'sl')
                && ! isNaN(value.h)
            ) {
                isHsl = true;
                value.h = value.h - Math.floor(value.h);
                if (value.h < 0) {
                    value.h = 1 + value.h;
                }
                currentHslColor = value;
                alpha = 1;
                if (haveFields(value, 'a')) {
                    alpha = value.a;
                }
                currentHslColor.a = alpha;
            } else if (haveFields(value, 'rgb')) {
                currentColor = value;
                alpha = 1;
                if (haveFields(value, 'a')) {
                    alpha = value.a;
                }
                currentColor.a = alpha;
                isHsl = false;
            } else if (haveFields(value, 'cmyk')) {
                currentColor = cmyk2rgb(value);
                currentColor.a = 1;
                isHsl = false;
            }
        }
        if (isHsl) {
            return {
                rgba: hsl2rgb(currentHslColor),
                hsla: currentHslColor,
                isHsl: isHsl
            };
        } else {
            return {
                rgba: currentColor,
                hsla: rgb2hsl(currentColor),
                isHsl: isHsl
            };
        }
    }

    // Used to expand shorthand hex strings
    function replaceCallback(match) {
        return match + match;
    }

    // Channel validity checker
    function haveFields(value, fields) {
        var i, temp;
        for (i in fields.split('')) {
            temp = parseFloat(value[fields[i]]);
            if (isNaN(temp)
                || temp < 0
                || temp > 1
            ) {
                return 0;
            }
        }
        return 1;
    }

    // converters
    function rgb2hex(input) {
        var value, byte, retval = '', i=0;
        for (;i<3;i++) {
            byte = round(input[['r','g','b'][i]] * 255);
            value = byte.toString(16);
            if (byte < 16) {
                value = "0" + value;
            }
            retval += value;
        }
        return '#' + retval;

    }
    function hex2rgb(value) {
        var i=0, retval = {};
        for (;i<3;i++) {
            retval[i] = parseInt('0x' + value.substring(i*2+1,i*2+3), 16) / 255;
        }
        return {
            r: retval[0],
            g: retval[1],
            b: retval[2]
        };
    }
    function hexa2rgb(value) {
        var i=0, retval = {};
        for (;i<4;i++) {
            retval[i] = parseInt('0x' + value.substring(i*2+1,i*2+3), 16) / 255;
        }
        return {
            r: retval[0],
            g: retval[1],
            b: retval[2],
            a: retval[3]
        };
    }
    function rgb2hsl(value) {
        var r = value.r,
        g = value.g,
        b = value.b,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h,
        s,
        l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {
            h: h,
            s: s,
            l: l,
            a: value.a
        };
    }
    function hsl2rgb(value) {
        var r, g, b;
        if (value.s === 0) {
            r = g = b = value.l; // achromatic
        } else {
            var hue2rgb = function (p, q, t) {
                if (t < 0) {
                    t += 1;
                } else if (t > 1) {
                    t -= 1;
                }
                if (t < 1/6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1/2) {
                    return q;
                }
                if (t < 2/3) {
                    return p + (q - p) * (2/3 - t) * 6;
                }
                return p;
            };

            var q;
            if (value.l < 0.5) {
                q = value.l * (1 + value.s);
            } else {
                q = value.l + value.s - value.l * value.s;
            }
            var p = 2 * value.l - q;
            r = hue2rgb(p, q, value.h + 1/3);
            g = hue2rgb(p, q, value.h);
            b = hue2rgb(p, q, value.h - 1/3);
        }
        return {
            r: r,
            g: g,
            b: b,
            a: value.a
        };
    }
    function rgb2cmyk(value) {
        // achromatic
        if (value.r === value.g && value.g === value.b) {
            return {
                c:0,
                m:0,
                y:0,
                k:1 - value.r
            };
        }
        var k = Math.min(
            1 - value.r,
            1 - value.g,
            1 - value.b
        );
        return {
            c:(1 - value.r - k) / (1 - k),
            m:(1 - value.g - k) / (1 - k),
            y:(1 - value.b - k) / (1 - k),
            k:k
        };
    }
    function cmyk2rgb(value) {
        return {
            r: 1 - Math.min(1, value.c * (1 - value.k) + value.k),
            g: 1 - Math.min(1, value.m * (1 - value.k) + value.k),
            b: 1 - Math.min(1, value.y * (1 - value.k) + value.k),
            a: 1
        };
    }
    return Color;
})();