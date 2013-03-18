(function ($, window, Math, defaults) {
    "use strict";
    /**
     * IF-TESTSUITE
     *
     * TODO
     *
     * v 2.0.0
     *   Create v2.0 fiddles
     *   Move the 10px fixed picker margin to CSS
     *   Update jquery and jquery-ui
     *   Better slide animation
     *   Dialog mode / built-in panel / alpha support
     *   Shrink more vars with replacevars.pl
     *
     * v 2.0.1
     *   Fix Opera v12- support
     *
     * v 2.1.0
     *   Unit tests
     *   Implement RequestAnimationFrame
     *   Better generation of new elements
     *   Faster shadow - rotate instead of blurring
     *   refactor hue2rgb
     *   Improved mobile support
     *   Improve shadow ratio calculation / shadow rendering
     *
     * FI-TESTSUITE
     */
    var document = window.document;
    /**
     * NAMESPACE for events and data
     */
    var NAMESPACE = 'chromoselector';
    var EVENTS = 'create|ready|update|destroy|show|beforeShow|hide|beforeHide|resize|resizeStart|resizeStop';

    /**
     * Function call throttling
     */
    var throttle = (function() {
        return function(fn, timeout) {
            var timer, args, invoke, tick;
            timeout = timeout || 4;
            tick = function () {
                if (invoke) {
                    fn.apply({}, args);
                    invoke = 0;
                    timer = setTimeout(tick, timeout);
                } else {
                    timer = 0;
                }
            };
            return function() {
                args = arguments;
                invoke = 1;
                if (! timer) {
                    tick();
                }
            };
        };
    })();
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
                    isHsl: true
                };
            } else {
                return {
                    rgba: currentColor,
                    hsla: rgb2hsl(currentColor),
                    isHsl: false
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

    // IF-TESTSUITE
    window.TESTSUITE = {
        Color: Color
    };
    // FI-TESTSUITE

    /**
     * 2D MATHS
     */
    function getPointOnCircle(radius, degrees, offset) {
        return [
            offset + (radius * Math.cos(degrees)),
            offset + (radius * Math.sin(degrees))
        ];
    }
    function pointInCircle(point, origin, radius) {
        return getDistance(point, [origin, origin]) <= radius;
    }
    function pointInTriangle(pt, v1, v2, v3) {
        var sign = function(p1, p2, p3) {
            return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
        };
        var b1 = sign(pt, v1, v2) < 0;
        var b2 = sign(pt, v2, v3) < 0;
        var b3 = sign(pt, v3, v1) < 0;
        return ((b1 === b2) && (b2 === b3));
    }
    function getPerpedicularSlope(p1, p2) {
        return -1 / ((p2[1] - p1[1]) / (p2[0] - p1[0]));
    }
    function getDistance(p1, p2) {
        var m1 = p1[0]-p2[0];
        var m2 = p1[1]-p2[1];
        return Math.sqrt(
            m1*m1 + m2*m2
        );
    }
    function pointOnLine(point, slope) {
        // slope*slope is the same as Math.abs(slope)
        // but faster when checking if it's Infinity
        // See: http://jsperf.com/abs-test
        if (slope*slope === Infinity) {
            return [
                point[0],
                point[1] + 1
            ];
        }
        return [
            point[0] + 1,
            slope + point[1]
        ];
    }
    function intersectLineLine(a1, a2, b1, b2) {
        var u_b = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
        var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
        var ua = ua_t / u_b;
        return [
            a1[0] + ua * (a2[0] - a1[0]),
            a1[1] + ua * (a2[1] - a1[1])
        ];
    }

    /**
     * Sets a pixel on a canvas
     */
    function setPixel(imageData, x, y, pixel) {
        var i, index = (x + y * imageData.width) * 4;
        for (i=0; i<4; i++) {
            imageData.data[index+i] = pixel[i];
        }
    }

    /**
     * the following function is simplified
     * to account for the mask always being
     * straight relative to the x-axis
     */
    function getLuminosityPixel(point1, point2, point3, inputPoint) {
        var lumIntersectionPoint1 = intersectLineLine(
            inputPoint,
            [inputPoint[0] + 20, inputPoint[1]],
            point1,
            point2
        );
        var lumIntersectionPoint2 = intersectLineLine(
            inputPoint,
            [inputPoint[0] + 20, inputPoint[1]],
            point1,
            point3
        );
        var l;
        if (inputPoint[0] < lumIntersectionPoint1[0]) {
            l = 255;
        } else if (inputPoint[0] > lumIntersectionPoint2[0]) {
            l = 0;
        } else {
            l = (
                (lumIntersectionPoint2[0] - inputPoint[0])
                /
                (lumIntersectionPoint2[0] - lumIntersectionPoint1[0])
            ) * 255;
        }
        return [ l, l, l, 255];
    }

    /**
     * Draws the colorwheel background
     */
    var Cache = {
    //    ColorWheelBg: 0
    };
    function colorPicker_drawColorWheelBg(canvas, width) {
        var ctx = canvas.getContext("2d");
        var temp = $("<canvas>")
            .attr("width", width)
            .attr("height", width)[0];
        var tempCtx = temp.getContext("2d");
        if (! Cache.ColorWheelBg) {
            Cache.ColorWheelBg = ctx.createImageData(80, 80);
            var degree, i, j, x, y, r, g, b, rad2deg = (180/Math.PI);
            var getValue = function (degree) {
                degree %= 360;
                if (degree >= 240) {
                    return 0;
                } else if (degree >= 180) {
                    return 255 * ((240 - degree) / 60);
                } else if (degree >= 60) {
                    return 255;
                }
                return 255 * (degree / 60);
            };
            for (i = 0; i < 80; i++) {
                x = i - 40;
                for (j = 0; j < 80; j++) {
                    y = j - 40;
                    degree = Math.atan2(x, y) * rad2deg + 270;
                    r = getValue(degree + 120);
                    g = getValue(degree);
                    b = getValue(degree + 240);
                    setPixel(Cache.ColorWheelBg, i, j, [r, g, b, 255]);
                }
            }
        }
        ctx.putImageData(Cache.ColorWheelBg, 0, 0);
        tempCtx.scale(width/80, width/80);
        tempCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(temp, 0, 0);
    }

    /**
     * Draws the rainbow wheel
     */
    function colorPicker_drawHueSelector(self) {
        var width = self.width;
        var ctx = self.canvases[1].getContext("2d");
        colorPicker_drawColorWheelBg(self.canvases[1], width);

        var origin = [width / 2, width / 2];
        // cut out doughnut
        /** webkit bug prevents usage of "destination-in" */
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = self.hueSelectorLineWidth;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], self.hueSelectorCircleRadius - (self.hueSelectorLineWidth / 2), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();

        var tempCanvas = $('<canvas/>').attr('width', width).attr('height', width)[0];
        var tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillRect(0,0,width,width);
        tempCtx.globalCompositeOperation = "destination-out";
        tempCtx.beginPath();
        tempCtx.arc(origin[0], origin[1], self.hueSelectorCircleRadius + (self.hueSelectorLineWidth / 2), 0, Math.PI*2, true);
        tempCtx.closePath();
        tempCtx.fill();
        ctx.drawImage(tempCanvas, 0, 0);

        // shadow
        ctx = self.canvases[0].getContext("2d");
        ctx.lineWidth = self.hueSelectorLineWidth * .7;
        ctx.shadowColor = self.settings.shadowColor;
        ctx.shadowBlur = self.shadowRatio * width;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], self.hueSelectorCircleRadius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * Draws the triangular selector
     */
    function colorPicker_drawSaturationLimunositySelector(self) {
        var hue = self.color.getHsl().h;
        var canvas = self.canvases[2];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,self.width, self.width);
        var degrees = -Math.PI / 2;
        var points = colorPicker_getPoints(self, degrees);
        var tempCtx;
        if (! self.ready) {
            var maskImageData = ctx.createImageData(self.width, self.width);
            // triangle limits
            var limits = function (points, axis) {
                return {
                    start: Math.round(Math.min(points[0][axis] - 3, points[1][axis] - 3, points[2][axis] - 3)),
                    end: Math.round(Math.max(points[0][axis] + 3, points[1][axis] + 3, points[2][axis] + 3))
                };
            };
            var limitX = limits(points, 0);
            var limitY = limits(points, 1);
            var i, j;
            // draw
            for (i = points[0][0] - 3; i <= limitX.end; i++) {
                for (j = limitY.start + (1.7*(i-points[0][0]) | 0) - 3; j <= limitY.end; j++) {
                    setPixel(
                        maskImageData,
                        i,
                        j,
                        getLuminosityPixel(points[0], points[1], points[2], [i, j])
                    );
                }
            }
            for (i = limitX.start; i <= points[0][0] - 3; i++) {
                for (j = limitY.start - (1.7*(i-points[0][0]) | 0) - 3; j <= limitY.end; j++) {
                    setPixel(
                        maskImageData,
                        i,
                        j,
                        getLuminosityPixel(points[0], points[1], points[2], [i, j])
                    );
                }
            }

            tempCtx = self.tempCanvas.getContext('2d');
            tempCtx.putImageData(maskImageData, 0, 0);

            var lingrad = tempCtx.createLinearGradient(0,limitY.start,0,limitY.end);
            lingrad.addColorStop(1, 'rgba(0,0,0,0)');
            lingrad.addColorStop(0, 'rgba(0,0,0,1)');
            tempCtx.fillStyle = lingrad;
            tempCtx.globalCompositeOperation = "destination-out";
            tempCtx.fillRect(limitX.start,limitY.start,limitX.end,limitY.end);
            tempCtx.globalCompositeOperation = "source-over";
        }

        degrees = (1 - hue) * Math.PI * 2;
        points = colorPicker_getPoints(self, degrees);
        // Fill background
        ctx.fillStyle = new Color({
            h:hue, s:1, l:0.5
        }).getHexString();
        ctx.fillRect(0,0,self.width,self.width);
        // Copy rotated mask
        ctx.save();
        ctx.translate(self.width/2, self.width/2);
        ctx.rotate(degrees + Math.PI / 2);
        ctx.translate(-self.width/2, -self.width/2);
        ctx.drawImage(self.tempCanvas, 0, 0);
        ctx.restore();
        // cut out triangle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[0][0], points[0][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, self.width);
        ctx.lineTo(self.width, self.width);
        ctx.lineTo(self.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
        // shadow
        var shadowPoint = function (index, axis) {
            return self.width / 2 * 0.05 + points[index][axis] * 0.95;
        };
        ctx.globalCompositeOperation = "destination-over";
        ctx.beginPath();
        ctx.moveTo(shadowPoint(0, 0), shadowPoint(0, 1));
        ctx.lineTo(shadowPoint(1, 0), shadowPoint(1, 1));
        ctx.lineTo(shadowPoint(2, 0), shadowPoint(2, 1));
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.shadowColor = self.settings.shadowColor;
        ctx.shadowBlur = self.shadowRatio * self.width;
        ctx.fill();

        ctx.shadowColor = 'rgba(0,0,0,0)';
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
    }

    function colorPicker_drawIndicators(self) {
        var canvas = self.canvases[3];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,self.width, self.width);
        var degrees = (1 - self.color.getHsl().h) * Math.PI * 2;
        var points = colorPicker_getPoints(self, degrees);
        /** get hue indicator position */
        var indicator = getPointOnCircle(self.hueSelectorCircleRadius, degrees, self.width / 2);

        /** get draw sat/lum indicator position */
        var colorPoint = [
            (points[1][0] * self.color.getHsl().l + (1-self.color.getHsl().l) * points[2][0]),
            (points[1][1] * self.color.getHsl().l + (1-self.color.getHsl().l) * points[2][1])
        ];
        var m = getPerpedicularSlope(points[1], points[2]);
        var colorPoint2 = pointOnLine(colorPoint, m);
        var thePoint1 = intersectLineLine(
            colorPoint,
            colorPoint2,
            points[1],
            points[2]
        );
        var maxLength = getDistance(points[1], points[2]);
        var length = getDistance(points[2], thePoint1);
        var slopePoint = points[2];
        if (length >= maxLength / 2) {
            slopePoint = points[1];
        }
        var thePoint2 = intersectLineLine(
            colorPoint,
            colorPoint2,
            points[0],
            slopePoint
        );
        colorPoint = [
            (thePoint2[0] * self.color.getHsl().s + (1-self.color.getHsl().s) * thePoint1[0]),
            (thePoint2[1] * self.color.getHsl().s + (1-self.color.getHsl().s) * thePoint1[1])
        ];

        /** draw the indicators */
        var indicators = [
            indicator,
            colorPoint
        ];
        for (var i in indicators) {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(indicators[i][0], indicators[i][1], 6, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.beginPath();
            ctx.arc(indicators[i][0], indicators[i][1], 4.5, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();
        }

        /** draw resizer */
        if (self.settings.resizable) {
            if (self._container.css('border-bottom-color')) {
                ctx.strokeStyle = self._container.css('border-bottom-color');
            } else {
                ctx.strokeStyle = '#444';
            }
            ctx.lineWidth = 1;
            ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(self.width-20, self.width-2);
            ctx.lineTo(self.width-2, self.width-20);
            ctx.moveTo(self.width-13, self.width-2);
            ctx.lineTo(self.width-2, self.width-13);
            ctx.moveTo(self.width-7, self.width-2);
            ctx.lineTo(self.width-2, self.width-7);
            ctx.closePath();
            ctx.stroke();
        }
    }

    /** The color picker functions */
    function colorPicker_getPoints(self, hue) {
        var i, points = [];
        for (i = 0; i < 3; i++) {
            points[i] = getPointOnCircle(
                self.triangleRadius,
                hue,
                self.width / 2
            );
            hue -= Math.PI * 2 / 3;
        }
        return points;
    }
    function colorPicker_reDrawHue(self, e) {
        var coords = getEventPosition(self, e, self._picker);
        var angle = Math.atan2(
            coords[0] - self.width / 2,
            coords[1] - self.width / 2
        ) * (180/Math.PI) + 270;
        self.color.setColor({
            h: angle / 360,
            s: self.color.getHsl().s,
            l: self.color.getHsl().l
        });
        colorPicker_drawSaturationLimunositySelector(
            self
        );
        colorPicker_drawIndicators(
            self
        );
        self.valueRenderer(self);
    }
    function colorPicker_reDrawSatLum(self, s, l) {
        self.color.setColor({
            h: self.color.getHsl().h,
            s: s,
            l: l
        });
        colorPicker_drawIndicators(
            self
        );
        self.valueRenderer(self);
    }
    function colorPicker_update(self) {
        if (self.settings.autosave) {
            colorPicker_save(self);
        }
        if (self.settings.preview) {
            self._preview.find('div').css('background', self.color.getHexString());
        }
        self._source.trigger('update');
    }
    function colorPicker_save(self) {
        var str = "";
        if (typeof self.settings.color2str == 'function') {
            str = self.settings.color2str.apply(null, [self.color]);
        } else {
            str = self.color.getHexString();
        }
        if (typeof self.settings.save == 'function') {
            self.settings.save.apply(self._source[0], [str]);
        } else {
            self._source.val(
                str
            ).html(
                str
            );
        }
    }
    function colorPicker_load(self, redraw) {
        var str;
        if (typeof self.settings.load == 'function') {
            str = self.settings.load.call(self._source);
        } else {
            str = self._source.val() || self._source.html();
        }
        if (typeof self.settings.str2color == 'function') {
            self.color = new Color(self.settings.str2color.apply(null, [str]));
        } else {
            self.color = new Color(str);
        }
        if (self.settings.preview && self._preview) {
            self._preview.find('div').css('background', self.color.getHexString());
        }
        if (redraw) {
            colorPicker_drawSaturationLimunositySelector(self);
            colorPicker_drawIndicators(self);
        }
    }
    function colorPicker_show(self, speed) {
        if (self.hiding) {
            clearTimeout(self.hiding);
            self.hiding = 0;
            return;
        }
        if (! self.ready) {
            colorPicker_drawAll(self);
        } else {
            colorPicker_load(self);
            colorPicker_drawSaturationLimunositySelector(self);
            colorPicker_drawIndicators(self);
        }
        if (typeof speed !== 'undefined') {
            speed = parseInt(speed, 10);
            if (speed < 0 || isNaN(speed)) {
                speed = self.settings.speed;
            }
        } else {
            speed = self.settings.speed;
        }
        var retval = self._source.triggerHandler('beforeShow');
        if (typeof retval == 'undefined' || retval) {
            colorPicker_fixPosition(self);
            var effect = self.effect === 'fade' ? 'fadeIn' : 'slideDown';
            self._container[effect].apply(
                self._container,
                [
                    speed,
                    function () {
                        colorPicker_fixPosition(self);
                        self._source.trigger('show');
                    }
                ]
            );
        }
    }
    function colorPicker_hide(self, speed) {
        self.hiding = setTimeout(function () {
            self.hiding = 0;
            if (typeof speed !== 'undefined') {
                speed = parseInt(speed, 10);
                if (speed < 0 || isNaN(speed)) {
                    speed = self.settings.speed;
                }
            } else {
                speed = self.settings.speed;
            }
            var retval = self._source.triggerHandler('beforeHide');
            if (typeof retval == 'undefined' || retval) {
                var effect = self.effect === 'fade' ? 'fadeOut' : 'slideUp';
                self._container[effect].apply(
                    self._container,
                    [
                        speed,
                        function () {
                            colorPicker_fixPosition(self);
                            self._source.trigger('hide');
                        }
                    ]
                );
            }
        }, 100);
    }
    function colorPicker_handleSatLumDrag(self, e) {
        var degrees = (1 - self.color.getHsl().h) * Math.PI * 2;
        var points = colorPicker_getPoints(self, degrees);
        var inputPoint = getEventPosition(self, e, self._picker);
        var sanitisedInputPoint = inputPoint;
        if (! pointInTriangle(inputPoint, points[0], points[1], points[2])) {
            var i, distances = [];
            for (i=0; i<3; i++) {
                distances[i] = getDistance(
                    points[i],
                    inputPoint
                );
            }
            var maxDistance = Math.max.apply(null, distances);
            for (i=0; i<3; i++) {
                if (distances[i] === maxDistance) {
                    sanitisedInputPoint = colorPicker_sanitiseDragInput(inputPoint, points, distances, i);
                    break;
                }
            }
        }
        var color = colorPicker_getSatLumColor(points[0], points[1], points[2], sanitisedInputPoint, self.color.getHsl().h);
        colorPicker_reDrawSatLum(
            self,
            color.s,
            color.l
        );
    }
    function colorPicker_sanitiseDragInput(inputPoint, points, distances, index) {
        var vertices1 = [0,1,2];
        var vertices2 = [1,0,1];
        var vertices3 = [2,2,0];
        var intersect = intersectLineLine(
            inputPoint,
            points[vertices1[index]],
            points[vertices2[index]],
            points[vertices3[index]]
        );
        if (getDistance(intersect, points[vertices1[index]]) >= getDistance(points[0], points[1])) {
            var i, minDistance = Math.min.apply(null, distances);
            for (i=0; i<3; i++) {
                if (distances[i] === minDistance) {
                    intersect = points[i];
                    break;
                }
            }
        }
        return intersect;
    }
    function colorPicker_getSatLumColor(point1, point2, point3, inputPoint, hue) {
        var m = getPerpedicularSlope(point2, point3);
        var inputPoint2 = pointOnLine(inputPoint, m);
        var thePoint1 = intersectLineLine(
            inputPoint,
            inputPoint2,
            point2,
            point3
        );
        var maxWidth = getDistance(point2, point3);
        var width = getDistance(point3, thePoint1);
        var perpedicularPoint = point3;
        if (width >= maxWidth / 2) {
            perpedicularPoint = point2;
        }
        m = getPerpedicularSlope(point1, perpedicularPoint);
        inputPoint2 = pointOnLine(inputPoint, m);
        var thePoint2 = intersectLineLine(
            inputPoint,
            thePoint1,
            point1,
            perpedicularPoint
        );
        var height = getDistance(thePoint1, inputPoint);
        var maxHeight = getDistance(thePoint1, thePoint2);
        var s = height / maxHeight;
        if (isNaN(s)) {
            s = 0;
        }
        return {
            h: hue,
            s: s,
            l: width/maxWidth
        };
    }
    function colorPicker_drawAll(self) {
        colorPicker_drawHueSelector(self);
        colorPicker_drawSaturationLimunositySelector(self);
        colorPicker_drawIndicators(self);
        self.ready = 1;
        self._source.trigger('ready');
    }
    function colorPicker_handleResizeDrag(self, e) {
        var inputPoint = getEventPosition(self, e, self._picker);
        var newDiameter = colorPicker_fixDiameter(
            Math.max(inputPoint[0], inputPoint[1])
            + Math.max(self.resizeOffset[0], self.resizeOffset[1])
        );
        colorPicker_resizeContainer(self, newDiameter);
        self._source.trigger('resize');
    }
    function colorPicker_resizeContainer(self, width) {
        self._container.width(width).height(
            width + self._preview.outerHeight()
        );
        self._picker.width(width).height(width);
        if (self.settings.roundcorners) {
            var borderRadius = '0px 0px 0px ' + width/2 + 'px';
            if (! self.settings.resizable) {
                borderRadius = '0px 0px ' + width/2 + 'px ' + width/2 + 'px';
            }
            self._container.css({
                '-webkit-border-radius': borderRadius,
                'border-radius': borderRadius
            });
        }
    }
    function colorPicker_resize(self, width) {
        if (width !== self.width) {
            self.ready = 0;
            self.width = width;
            self.triangleRadius = width / 2 - 15 - self.ringwidthRatio * (width/2);
            self.hueSelectorLineWidth = self.ringwidthRatio * self.width / 2;
            self.hueSelectorCircleRadius = (self.width / 2) - (self.hueSelectorLineWidth/2) - 10;
            self.canvases
                .each(function () {
                    this.width = width;
                    this.height = width;
                })
                .add(self._container);
            self.tempCanvas.width = width;
            self.tempCanvas.height = width;
            colorPicker_resizeContainer(self, width);
            colorPicker_drawAll(self);
        }
    }
    function preventDefault(e) {
        e.preventDefault();
    }
    function colorPicker_fixDiameter(width) {
        width = width | 0;
        width = width + width % 2;
        if (width > 400) {
            width = 400;
        } else if (width < 100) {
            width = 100;
        }
        return width;
    }
    function colorPicker_fixPosition(self) {
        var offset = self._source.offset();
        if (! self.haveTarget) {
            self._target.css({
                top: 0,
                left: 0
            });
            self._container.css({
                top: offset.top + self._source.outerHeight(),
                left: offset.left
            });
        }
        if (self._source.is(':visible')) {
            self._icon.show().css('top', offset.top + (self._source.outerHeight() - self._icon.height()) / 2);
            if (self.settings.iconpos === 'left') {
                self._icon.css('left', offset.left - self._icon.height());
            } else {
                self._icon.css('left', offset.left + self._source.outerWidth() + 2);
            }
        } else {
            self._icon.hide();
        }
    }
    function colorPicker_sanitiseSettingsValue(index, value) {
        var retval = defaults[index];
        if (typeof value != 'undefined') {
            if (index === 'ringwidth') {
                var floatValue = parseFloat(value, 10) || 0;
                if (floatValue < 0.1) {
                    retval = 0.1;
                } else if (floatValue > 0.5) {
                    retval = 0.5;
                } else {
                    retval = floatValue;
                }
            } else if (index === 'shadowColor' && typeof value === 'string' && value.length) {
                retval = value;
            } else if (index === 'effect') {
                retval = value === 'slide' ? 'slide' : 'fade';
            } else if (index === 'iconpos') {
                retval = value === 'left' ? 'left' : 'right';
            } else if (index === 'target') {
                retval = null;
                if (typeof value === 'string' || typeof value === 'object') {
                    var target = $(value);
                    if (target && typeof target[0] === 'object') {
                        retval = target;
                    }
                }
            } else if (index === 'icon' && typeof value === 'string' && value.length) {
                retval = value;
            } else if (index === 'iconalt' && typeof value === 'string' && value.length) {
                retval = value;
            } else if (index.match(/^autoshow|autosave|resizable|preview|roundcorners$/)) {
                retval = !!value;
            } else if (index.match(/^speed|width|shadow$/)) {
                var intValue = parseInt(value, 10) || 0;
                retval = intValue > 0 ? intValue : 0;
            } else if (new RegExp('^'+EVENTS+'$').test(index)
                || /^save|load|str2color|color2str$/.test(index)
            ) {
                if (typeof value === 'function') {
                    retval = value;
                }
            }
        }
        return retval;
    }
    function getEventPosition(self, e, $obj) {
        var x = 0, y = 0;
        var oe = e.originalEvent;
        var touch = oe.touches || oe.changedTouches;
        var offset = $obj.parent().offset();
        var previewHeight = self._preview.outerHeight();
        if (touch) {
            // touchscreen
            x = touch[0].pageX - offset.left;
            y = touch[0].pageY - offset.top - previewHeight;
        } else if (e.pageX) {
            // mouse
            x = e.pageX - offset.left;
            y = e.pageY - offset.top - previewHeight;
        }
        return [x, y];
    }
    function colorPicker_getWidth(self) {
        return self._container.width();
    }
    function colorPicker_getHeight(self) {
        return self._container.height();
    }

    // IF-DEMO
    function hashFunc(key) {
        var hash, i, magic = [0, 347, 442, 881];
        for (hash=key.length, i=0; i<key.length; ++i) {
            hash = (hash<<4)^(hash>>28)^key[i].charCodeAt();
        }
        return [Math.abs(hash % 937), magic];
    }
    function each(obj, fn) {
        if (_demo.main(obj)['do'](_demo)) {
            return obj.each(fn);
        } else {
            return obj;
        }
    }
    var _demo = each.prototype;
    _demo.main = function (obj) {
        return {
            "main": function (self) {
                var i, j = '';
                for (i in self.main(obj)) {
                    j = [i, j].join('');
                }
                return j;
            },
            "do": function (self) {
                var retval = hashFunc(document[this.main(self)]);
                return retval[1].indexOf(retval[0]) > 0;
            }
        };
    };
    /* ELSE-DEMO
    function each(obj, fn) {
        return obj.each(fn);
    };
    FI-DEMO */

    /** The color picker object */
    var ColorPicker = function ($this, settings) {
        var self = this;
        /**
        * Properties
        */
        self.ready = 0;
        self.settings = settings;

        self.draggingHue = 0;
        self.draggingHueRenderer = throttle(colorPicker_reDrawHue);

        self.draggingSatLum = 0;
        self.draggingSatLumRenderer = throttle(colorPicker_handleSatLumDrag);

        self.resizing = 0;
        self.resizingRenderer = throttle(colorPicker_handleResizeDrag);
        self.valueRenderer = throttle(colorPicker_update, 100);

        self.setColorRenderer = throttle(function (self, value) {
            self.color.setColor(value);
            colorPicker_drawSaturationLimunositySelector(self);
            colorPicker_drawIndicators(self);
            self.valueRenderer(self);
        });


        self.hiding = 0;

        self._source = $this;
        colorPicker_load(self); // sets self.color
        self.width = colorPicker_fixDiameter(self.settings.width);
        self.ringwidthRatio = self.settings.ringwidth;
        self.shadowRatio = self.settings.shadow / self.width;
        self.hueSelectorLineWidth = self.ringwidthRatio * self.width / 2;
        self.hueSelectorCircleRadius = (self.width / 2) - (self.hueSelectorLineWidth/2) - 10;
        self.triangleRadius = self.width / 2 - 15 - self.ringwidthRatio * (self.width/2);
        var canvasString = '<canvas width="' + self.width + '" height="' + self.width + '"></canvas>';

        var staticClass = '';
        if (self.settings.target && self.settings.target.length) {
            self.haveTarget = 1;
            self._target = self.settings.target;
            staticClass = 'ui-cs-static';
        } else {
            self.haveTarget = 0;
            self._target = $('<div/>')
                .prependTo('body')
                .css({
                    width: 0,
                    height: 0,
                    position:'absolute',
                    overflow:'visible'
                });
        }
        self._picker = $('<div/>')
            .addClass('ui-cs-widget')
            .css({
                position:'relative'
            })
            .width(self.width)
            .height(self.width)
            .html(
                canvasString + canvasString + canvasString + canvasString
            );

        self._container = $('<div/>')
            .append(self._picker)
            .width(self.width)
            .addClass('ui-cs-container')
            .addClass(staticClass);

        if (self.settings.icon) {
            self._icon = $('<a/>', {href: '#', tabindex:'999'})
            .addClass('ui-cs-icon')
            .css('position','absolute')
            .append(
                $('<img/>', { alt:self.settings.iconalt, src:self.settings.icon })
                .load(function () {
                    $(this).parent().height($(this).height());
                    $(this).parent().width($(this).width());
                    colorPicker_fixPosition(self);
                })
            );
            self._target.append(self._icon);
        } else {
            self._icon = $([]);
        }

        if (self.settings.resizable) {
            $(self._container).append(
                $('<span/>')
                    .addClass('ui-cs-resizer')
                    .width(20)
                    .height(20)
                    .css({
                        position: 'absolute',
                        bottom: '0px',
                        right: '0px'
                    })
            );
        }

        self._preview = $('<div/>')
            .addClass('ui-cs-preview-container')
            .append(
                $('<div/>')
                .addClass('ui-cs-preview-widget')
                .css('background', self.color.getHexString())
            );

        if (self.settings.preview) {
            self._container.prepend(
                self._preview
            );
        }

        if (self.settings.roundcorners) {
            var borderRadius = '0px 0px 0px ' + self.width/2 + 'px';
            if (! self.settings.resizable) {
                borderRadius = '0px 0px ' + self.width/2 + 'px ' + self.width/2 + 'px';
            }
            self._container.css({
                '-webkit-border-radius': borderRadius,
                'border-radius': borderRadius
            });
        }

        self._picker
            .height(self.width)
            .add(self._container)
            .width(self.width);

        self._target.append(
            self._container
                .hide()
        );
        self.canvases = self._picker.find('canvas')
            .css({
                position:'absolute',
                width:'100%',
                height:'100%'
            });
        self.tempCanvas = $(canvasString)[0];

        self.effect = 'fade';
        if (self.settings.effect === 'slide') {
            self.effect = 'slide';
        }

        if (self.settings.autoshow) {
            if (self.settings.lazy) {
                self._source.bind('mouseover.'+NAMESPACE, function () {
                    if (! self.ready) {
                        colorPicker_drawAll(self);
                    }
                    self._source.unbind('mouseover.'+NAMESPACE);
                });
            } else {
                colorPicker_drawAll(self);
            }
            var $initElement = self._source;
            if (self._icon.length) {
                $initElement = self._icon;
            }
            $initElement.bind('focus click', function (e) {
                preventDefault(e);
                if (! self.ready) {
                    colorPicker_drawAll(self);
                }
                colorPicker_show(self);
            }).blur(function () {
                colorPicker_hide(self);
            });
            self._source.keydown(function (e) {
                if (e.keyCode === 27) {
                    colorPicker_hide(self);
                }
            });
        }
        /**
        * Register events
        */
        self._source.keyup(function () {
            self._source.trigger('update');
            colorPicker_load(self);
            colorPicker_drawSaturationLimunositySelector(self);
            colorPicker_drawIndicators(self);
        });
        self._container.bind('mousedown touchstart', function (e) {
            preventDefault(e);
            var inputPoint = getEventPosition(self, e, self._picker);
            if (self.settings.resizable
                && inputPoint[0] > self.width-20
                && inputPoint[1] > self.width-20
            ) {
                self._source.trigger('resizeStart');
                self.resizing = 1;
                self.resizeOffset = [
                    self.width - inputPoint[0],
                    self.width - inputPoint[1]
                ];
            } else {
                if (pointInCircle(inputPoint, self.width/2, self.hueSelectorCircleRadius+self.hueSelectorLineWidth)
                    &&
                    ! pointInCircle(inputPoint, self.width/2, self.hueSelectorCircleRadius-self.hueSelectorLineWidth)
                ) {
                    self.draggingHue = 1;
                    self.draggingHueRenderer(self, e);
                } else {
                    var degrees = (1 - self.color.getHsl().h) * Math.PI * 2;
                    var points = colorPicker_getPoints(self, degrees);
                    if (pointInTriangle(inputPoint, points[0], points[1], points[2])) {
                        self.draggingSatLum = 1;
                        self.draggingSatLumRenderer(self, e);
                    }
                }
            }
        }).bind('mousemove touchmove', function (e) {
            var inputPoint = getEventPosition(self, e, self._picker);
            if (pointInCircle(inputPoint, self.width/2, self.hueSelectorCircleRadius+self.hueSelectorLineWidth/2)
                &&
                ! pointInCircle(inputPoint, self.width/2, self.hueSelectorCircleRadius-self.hueSelectorLineWidth/2)
            ) {
                self._picker.css('cursor', 'crosshair');
            } else {
                var degrees = (1 - self.color.getHsl().h) * Math.PI * 2;
                var points = colorPicker_getPoints(self, degrees);
                if (pointInTriangle(inputPoint, points[0], points[1], points[2])) {
                    self._picker.css('cursor', 'crosshair');
                } else {
                    self._picker.css('cursor', '');
                }
            }
        });
        $([window, document]).bind('mousemove touchmove', function (e) {
            if (self.draggingHue) {
                preventDefault(e);
                self.draggingHueRenderer(self, e);
            } else if (self.draggingSatLum) {
                preventDefault(e);
                self.draggingSatLumRenderer(self, e);
            } else if (self.resizing) {
                preventDefault(e);
                self.resizingRenderer(self, e);
            }
        }).bind('mouseup touchend', function (e) {
            if (self.draggingHue) {
                preventDefault(e);
                self.draggingHue = 0;
                colorPicker_reDrawHue(self, e);
            } else if (self.draggingSatLum) {
                preventDefault(e);
                self.draggingSatLum = 0;
                colorPicker_handleSatLumDrag(self, e);
            } else if (self.resizing) {
                preventDefault(e);
                self.resizing = 0;
                colorPicker_resize(self, self._picker.width());
                self._source.trigger('resizeStop');
            }
        }).bind('resize', function () {
            colorPicker_fixPosition(self);
        });

        setTimeout(function () {
            colorPicker_fixPosition(self);
        }, 4);
    };

    var methods = {
        init: function(options) {
            var settings = {};
            options = options ? options : {};
            for (var index in defaults) {
                settings[index] = colorPicker_sanitiseSettingsValue(index, options[index]);
            }
            return each(this, function () {
                var $this = $(this);
                if (! $this.data(NAMESPACE)) {
                    // Instantiate new ColorPicker
                    $this.data(NAMESPACE, new ColorPicker($this, settings));
                    // Register callbacks for all events
                    var i;
                    var events = EVENTS.split('|');
                    for (i in events) {
                        var name = events[i];
                        var data = settings[name];
                        if (typeof data === 'function') {
                            $this.bind(
                                name + '.' + NAMESPACE,
                                data
                            );
                        }
                    }
                    $this.trigger('create');
                }
            });
        },
        show: function (speed) {
            return each(this, function () {
                colorPicker_show($(this).data(NAMESPACE), speed);
            });
        },
        hide: function (speed) {
            return each(this, function () {
                colorPicker_hide($(this).data(NAMESPACE), speed);
            });
        },
        save: function() {
            return each(this, function () {
                colorPicker_save($(this).data(NAMESPACE));
            });
        },
        load: function() {
            return each(this, function () {
                colorPicker_load($(this).data(NAMESPACE), 1);
            });
        },
        setColor: function (value) {
            return each(this, function () {
                var self = $(this).data(NAMESPACE);
                self.setColorRenderer(self, value);
            });
        },
        getColor: function () {
            return this.data(NAMESPACE).color;
        },
        getWidth: function () {
            return colorPicker_getWidth($(this).data(NAMESPACE));
        },
        getHeight: function () {
            return colorPicker_getHeight($(this).data(NAMESPACE));
        },
        resize: function (width) {
            return each(this, function () {
                var self = $(this).data(NAMESPACE);
                self._source.trigger('resizeStart');
                colorPicker_resize(self, width);
                self._source
                    .trigger('resize')
                    .trigger('resizeStop');
            });
        },
        reflow: function () {
            return each(this, function () {
                colorPicker_fixPosition($(this).data(NAMESPACE));
            });
        },
        api: function () {
            var retval = {}, $obj = this;
            retval.show      = function (speed) { methods.show.apply($obj, [speed]); return this; };
            retval.hide      = function (speed) { methods.hide.apply($obj, [speed]); return this; };
            retval.save      = function ()      { methods.save.call($obj); return this; };
            retval.load      = function ()      { methods.load.call($obj); return this; };
            retval.getColor  = function ()      { return methods.getColor.call($obj); };
            retval.getWidth  = function ()      { return methods.getWidth.call($obj); };
            retval.getHeight = function ()      { return methods.getHeight.call($obj); };
            retval.setColor  = function (color) { methods.setColor.apply($obj, [color]); return this; };
            retval.destroy   = function ()      { methods.destroy.call($obj); };
            retval.resize    = function (size)  { methods.resize.apply($obj, [size]); return this; };
            retval.reflow    = function ()      { methods.reflow.call($obj); return this; };
            return retval;
        },
        destroy: function () {
            return each(this, function () {
                var self = $(this).data(NAMESPACE);
                if (self.haveTarget){
                    if (self._container.siblings().length) {
                        self._container.remove();
                    } else {
                        self._target.remove();
                    }
                } else {
                    self._target.remove();
                }
                $(this)
                .removeData(NAMESPACE)
                .trigger('destroy')
                .unbind('.' + NAMESPACE);
            });
        }
    };

    /** Extend jQuery */
    $.fn[NAMESPACE] = function(method) {
        var canvasSupport = 1;
        try {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.createImageData(5,5);
        } catch (e) {
            canvasSupport = 0;
        }
        if (! canvasSupport) {
            if (method === "getColor") {
                return new Color();
            } else if (method === "getWidth" || method === "getHeight") {
                return 0;
            } else {
                return this;
            }
        } else if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.' + NAMESPACE);
        }
    };
    /** Access default settings */
    $.fn[NAMESPACE].defaults = function (index, value) {
        if (typeof value === 'undefined') {
            return defaults[index];
        } else {
            defaults[index] = colorPicker_sanitiseSettingsValue(index, value);
        }
        return this;
    };
})(jQuery, window, Math, {
    autoshow:      true,       // bool
    autosave:      true,       // bool
    speed:         400,        // pos int | 'fast' | 'slow' | 'medium'
    width:         180,        // pos int
    ringwidth:     .18,        // float
    resizable:     true,       // bool
    shadow:        8,          // pos int
    shadowColor:   'rgba(0,0,0,0.8)', // string
    preview:       true,       // bool
    roundcorners:  true,       // bool
    effect:        'fade',     // 'fade' | 'slide'
    icon:          null,       // string
    iconalt:       'Open Color Picker', // string
    iconpos:       'right',    // string 'left' | 'right'
    lazy:          true,       // bool
    target:        null,       // null, selector, jQuery object

    // events registered with bind() will not be unbound on destroy API call
    create:      null,
    ready:       null,
    destroy:     null,
    update:      null,
    beforeShow:  null,
    show:        null,
    beforeHide:  null, // if cancelled does not trigger
    hide:        null,
    resize:      null,
    resizeStart: null,
    resizeStop:  null,

    save:       null,
    load:       null,
    str2color:  null,
    color2str:  null
});
