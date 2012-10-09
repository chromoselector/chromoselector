/**
 *
 * jQuery 1.3+
 *
 * TODO:
 *
 * v 1.0.0:
 *   Documentation
 *   refactor hue2rgb
 *   converters code
 *   Alpha selection
 *
 * v 1.1.0:
 *   IE 6+ support
 *   HSV support
 *   better performance rendering colorwheel
 *   shorter code
 */
(function ($, document, window, Math, defaults) {
    "use strict";
    if (typeof TESTSUITE === 'undefined') {
        window.TESTSUITE = function (w) {
            w.Color = Color;
            w.Color_rgb2hsl = Color_rgb2hsl;
            w.Color_rgb2hex = Color_rgb2hex;
            w.Color_hsl2rgb = Color_hsl2rgb;
            w.Color_hex2rgb = Color_hex2rgb;
            w.Color_rgb2cmyk = Color_rgb2cmyk;
            w.Color_cmyk2rgb = Color_cmyk2rgb;
            w.setPixel = setPixel;
            w.roundPoint = roundPoint;
            w.getPointOnCircle = getPointOnCircle;
            w.getLumAlphaColor = getLumAlphaColor;
            w.ColorPicker_getPoints = ColorPicker_getPoints;
            w.i = 0;
            w.x = 0;
            w.y = 0;
            w.j = 0;
            w.degree= 0;
            w.r = 0;
            w.g = 0;
            w.b = 0;
        }
    }
    /**
     * NAMESPACE for events and data
     */
    var NAMESPACE = 'canvasColorPicker';
    /**
     * COLOR MANAGEMENT
     */
    function Color(value) {
        var self = this;
        // default to black
        self.rgb  = { r:0, g:0, b:0 };
        self.hsl  = { h:0, s:0, l:0 };
        self.cmyk = { c:0, m:0, y:0, k:1 };
        self.hex  = "#000000";
        self.setColor(value);
    };
    // setters
    Color.prototype.setColor = function(value) {
        var self = this;
        if (typeof value == 'string') {
            Color_setHex(self, value);
        } else if (typeof value == 'object') {
            var haveFields = function (value, fields) {
                for (var i in fields.split('')) {
                    if (typeof value[fields[i]] != 'number'
                        || value[fields[i]] < 0
                        || value[fields[i]] > 1
                    ) {
                        return 0;
                    }
                }
                return 1;
            };
            if (haveFields(value, 'hsl')) {
                Color_setHsl(self, value);
            } else if (haveFields(value, 'rgb')) {
                Color_setRgb(self, value);
            } else if (haveFields(value, 'cmyk')) {
                Color_setCmyk(self, value);
            } else if (typeof value.hsl == 'object') {
                self.setColor(value.hsl);
            } else if (typeof value.rgb == 'object') {
                self.setColor(value.rgb);
            } else if (typeof value.cmyk == 'object') {
                self.setColor(value.cmyk);
            }
        }
        return self;
    }
    function Color_setRgb(self, value) {
        self.rgb = value;
        self.hsl = Color_rgb2hsl(value);
        self.cmyk = Color_rgb2cmyk(value);
        self.hex = Color_rgb2hex(value);
    }
    function Color_setHsl(self, value) {
        value.h = value.h - Math.floor(value.h);
        if (value.h < 0) {
            value.h = 1 + value.h;
        }
        self.hsl = value;
        self.rgb = Color_hsl2rgb(value);
        self.cmyk = Color_rgb2cmyk(self.rgb);
        self.hex = Color_rgb2hex(self.rgb);
    }
    function Color_setHex(self, value) {
        var r = /^#([0-9a-f]{3}){1,2}$/i;
        if (r.test(value)) {
            if (value.length === 4) {
                value = value.replace(/[0-9a-f]/gi, function(match) {
                    return match + match;
                });
            }
            self.hex = value;
            self.rgb = Color_hex2rgb(value);
            self.cmyk = Color_rgb2cmyk(self.rgb);
            self.hsl = Color_rgb2hsl(self.rgb);
        }
    }
    function Color_setCmyk(self, value) {
        self.cmyk = value;
        self.rgb = Color_cmyk2rgb(value);
        self.hsl = Color_rgb2hsl(self.rgb);
        self.hex = Color_rgb2hex(self.rgb);
    }

    // converters
    function Color_rgb2hsl(value) {
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
            l: l
        };
    }
    function Color_rgb2hex(input) {
        var value, byte, retval = '', i=0;
        for (;i<3;i++) {
            byte = Math.round(input[['r','g','b'][i]] * 255);
            value = byte.toString(16);
            if (byte < 16) {
                value = "0" + value;
            }
            retval += value;
        }
        return '#' + retval;

    }
    function Color_hex2rgb(value) {
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
    function Color_hsl2rgb(value) {
        var r, g, b;
        if (value.s == 0) {
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
            var q = value.l < 0.5 ? value.l * (1 + value.s) : value.l + value.s - value.l * value.s;
            var p = 2 * value.l - q;
            r = hue2rgb(p, q, value.h + 1/3);
            g = hue2rgb(p, q, value.h);
            b = hue2rgb(p, q, value.h - 1/3);
        }
        return {
            r: r,
            g: g,
            b: b
        };
    }

    function Color_rgb2cmyk(value) {
        // achromatic
        if (value.r == value.g && value.g == value.b) {
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
    function Color_cmyk2rgb(value) {
        return {
            r: 1 - Math.min(1, value.c * ( 1 - value.k ) + value.k),
            g: 1 - Math.min(1, value.m * ( 1 - value.k ) + value.k),
            b: 1 - Math.min(1, value.y * ( 1 - value.k ) + value.k)
        };
    }

    /**
     * 2D MATHS
     */
    function roundPoint(point) {
        return [
            Math.round(point[0]),
            Math.round(point[1])
        ];
    }
    function getPointOnCircle(radius, degrees, offset) {
        return [
            offset + (radius * Math.cos(degrees)),
            offset + (radius * Math.sin(degrees))
        ];
    }
    function getMidpoint(p1, p2) {
        return [
            (p1[0] + p2[0]) / 2,
            (p1[1] + p2[1]) / 2
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
        return Math.sqrt(
            (p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1])
        );
    }
    function pointOnLine(point, slope) {
        if (Math.abs(slope) === Infinity) {
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
    function getLumAlphaColor(point1, point2, point3, inputPoint) {
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
            l = ((lumIntersectionPoint2[0] - inputPoint[0]) / (lumIntersectionPoint2[0] - lumIntersectionPoint1[0])) * 255;
        }
        return [ l, l, l, 255];
    }

    /**
     * Draws the colorsheel background
     */
    var Cache = {
        ColorWheelBg: 0
    };
    function ColorPicker_drawColorWheelBg(canvas, diameter) {
        var ctx = canvas.getContext("2d");
        var temp = $("<canvas>").attr("width", diameter).attr("height", diameter)[0];
        var tempCtx = temp.getContext("2d");
        if (! Cache.tempData) {
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
        tempCtx.scale(diameter/80, diameter/80);
        tempCtx.drawImage(canvas, 0, 0);
        ctx.drawImage(temp, 0, 0);
    }

    /**
     * Draws the rainbow wheel
     */
    function ColorPicker_drawHueSelector(self) {
        var diameter = self.diameter;
        var ctx = self.canvases[0].getContext("2d");
        ColorPicker_drawColorWheelBg(self.canvases[0], diameter);
        var lineWidth = self.widthRatio * diameter;
        var circleRadius = (diameter / 2) - 5 - lineWidth / 2;
        var origin = [diameter / 2, diameter / 2];
        // cut out doughnut
        /** webkit bug prevents usage of "destination-in" */
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius - (self.widthRatio * diameter / 2), 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = circleRadius * 2 - (self.widthRatio * diameter / 2);
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius * 2, 0, Math.PI*2);
        ctx.closePath();
        ctx.stroke();
        // shadow
        ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = lineWidth / 2;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = self.shadowRatio * diameter;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius - lineWidth / 8, 0, Math.PI*2);
        ctx.closePath();
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
    }

    /**
     * Draws the triangular selector
     */
    function ColorPicker_drawSaturationLimunositySelector(self) {
        var hue = self.color.hsl.h;
        var canvas = self.canvases[1];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,self.diameter, self.diameter);
        var degrees = -Math.PI / 2;
        var points = ColorPicker_getPoints(self, degrees);
        var tempCtx;
        if (! self.ready) {
            var maskImageData = ctx.createImageData(self.diameter, self.diameter);
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
                        getLumAlphaColor(points[0], points[1], points[2], [i, j])
                    );
                }
            }
            for (i = limitX.start; i <= points[0][0] - 3; i++) {
                for (j = limitY.start - (1.7*(i-points[0][0]) | 0) - 3; j <= limitY.end; j++) {
                    setPixel(
                        maskImageData,
                        i,
                        j,
                        getLumAlphaColor(points[0], points[1], points[2], [i, j])
                    );
                }
            }

            tempCtx = self.tempCanvas.getContext('2d');
            tempCtx.putImageData(maskImageData, 0, 0);

            var lingrad = tempCtx.createLinearGradient(0,limitY.start,0,limitY.end);
            lingrad.addColorStop(1, 'rgba(0,0,0,0)');
            lingrad.addColorStop(0, 'rgba(0,0,0,255)');
            tempCtx.fillStyle = lingrad;
            tempCtx.globalCompositeOperation = "destination-out";
            tempCtx.fillRect(limitX.start,limitY.start,limitX.end,limitY.end);
            tempCtx.globalCompositeOperation = "source-over";
        }

        degrees = (1 - hue) * Math.PI * 2;
        points = ColorPicker_getPoints(self, degrees);
        // Fill background
        ctx.fillStyle = Color_rgb2hex(
            Color_hsl2rgb({
                h:hue, s:1, l:0.5
            })
        );
        ctx.fillRect(0,0,self.diameter,self.diameter);
        // Copy rotated mask
        ctx.save();
        ctx.translate(self.diameter/2, self.diameter/2);
        ctx.rotate(degrees + Math.PI / 2);
        ctx.translate(-self.diameter/2, -self.diameter/2);
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
        ctx.lineTo(0, self.diameter);
        ctx.lineTo(self.diameter, self.diameter);
        ctx.lineTo(self.diameter, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        // shadow
        var newPoints = [];
        newPoints[0] = [
            self.diameter / 2 * 0.05 + points[0][0] * 0.95,
            self.diameter / 2 * 0.05 + points[0][1] * 0.95
        ];
        newPoints[1] = [
            self.diameter / 2 * 0.05 + points[1][0] * 0.95,
            self.diameter / 2 * 0.05 + points[1][1] * 0.95
        ];
        newPoints[2] = [
            self.diameter / 2 * 0.05 + points[2][0] * 0.95,
            self.diameter / 2 * 0.05 + points[2][1] * 0.95
        ];
        ctx.globalCompositeOperation = "destination-over";
        ctx.beginPath();
        ctx.moveTo(newPoints[0][0], newPoints[0][1]);
        ctx.lineTo(newPoints[1][0], newPoints[1][1]);
        ctx.lineTo(newPoints[2][0], newPoints[2][1]);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = self.shadowRatio * self.diameter;
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0)';
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
    }

    function ColorPicker_drawIndicators(self) {
        var canvas = self.canvases[2];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,self.diameter, self.diameter);
        var degrees = (1 - self.color.hsl.h) * Math.PI * 2;
        var points = ColorPicker_getPoints(self, degrees);
        /** draw hue indicator */
        var circleRadius = (self.diameter / 2) - 5 - (self.widthRatio * self.diameter * 2 / 3);

        var indicator = getPointOnCircle(circleRadius, degrees, self.diameter / 2);
        ctx.strokeStyle = "rgba(1,1,1,1)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(indicator[0], indicator[1], 4, 0, Math.PI*2);
        ctx.closePath();
        ctx.stroke();

        /** draw sat/lum indicator */
        var colorPoint = [
            (points[1][0] * self.color.hsl.l + (1-self.color.hsl.l) * points[2][0]),
            (points[1][1] * self.color.hsl.l + (1-self.color.hsl.l) * points[2][1])
        ];
        var m = getPerpedicularSlope(points[1], points[2]);
        var colorPoint2 = pointOnLine(colorPoint, m);
        var thePoint1 = intersectLineLine(
            colorPoint,
            colorPoint2,
            points[1],
            points[2]
        );
        var maxWidth = getDistance(points[1], points[2]);
        var width = getDistance(points[2], thePoint1);
        var slopePoint = points[2];
        if (width >= maxWidth / 2) {
            slopePoint = points[1];
        }
        var thePoint2 = intersectLineLine(
            colorPoint,
            colorPoint2,
            points[0],
            slopePoint
        );
        colorPoint = [
            (thePoint2[0] * self.color.hsl.s + (1-self.color.hsl.s) * thePoint1[0]),
            (thePoint2[1] * self.color.hsl.s + (1-self.color.hsl.s) * thePoint1[1])
        ];
        ctx.beginPath();
        ctx.arc(colorPoint[0], colorPoint[1], 4, 0, Math.PI*2);
        ctx.closePath();
        ctx.stroke();

        /** draw resizer */
        if (self.settings.resizable) {
            if (self.$container.css('border-bottom-color')) {
                ctx.strokeStyle = self.$container.css('border-bottom-color');
            } else {
                ctx.strokeStyle = '#444';
            }
            ctx.lineWidth = 1;
            ctx.lineCap="round";
            ctx.beginPath();
            ctx.moveTo(self.diameter-20, self.diameter-2);
            ctx.lineTo(self.diameter-2, self.diameter-20);
            ctx.moveTo(self.diameter-13, self.diameter-2);
            ctx.lineTo(self.diameter-2, self.diameter-13);
            ctx.moveTo(self.diameter-7, self.diameter-2);
            ctx.lineTo(self.diameter-2, self.diameter-7);
            ctx.closePath();
            ctx.stroke();
        }
        setTimeout(function () {
            self.drawing = 0;
        }, 4);
    }

    /** The color picker functions */
    function ColorPicker_getPoints(self, hue) {
        var i, points = [];
        for (i = 0; i < 3; i++) {
            points[i] = getPointOnCircle(
                self.triangleRadius,
                hue,
                self.diameter / 2
            );
            hue -= Math.PI * 2 / 3;
        }
        return points;
    }
    function ColorPicker_reDrawHue(self, e) {
        var offset = self.$picker.offset();
        var coords = getEventPosition(self, e, self.$picker);
        var angle = Math.atan2(
            coords[0] - self.diameter / 2,
            coords[1] - self.diameter / 2
        ) * (180/Math.PI) + 270;
        Color_setHsl(self.color, {
            h: angle / 360,
            s: self.color.hsl.s,
            l: self.color.hsl.l
        });
        ColorPicker_drawSaturationLimunositySelector(
            self
        );
        ColorPicker_drawIndicators(
            self
        );
        self.drawing = 1;
        ColorPicker_setValue(self);
    }
    function ColorPicker_reDrawSatLum(self, s, l) {
        Color_setHsl(self.color, {
            h: self.color.hsl.h,
            s: s,
            l: l
        });
        ColorPicker_drawIndicators(
            self
        );
        self.drawing = 1;
        ColorPicker_setValue(self);
    }
    function ColorPicker_setValue(self) {
        if (! self.timeout) {
            self.$source.trigger('update.' + NAMESPACE);
            var f = function () {
                self.timeout = 0;
            };
            if (self.settings.autosave) {
                f = function () {
                    self.timeout = 0;
                    ColorPicker_save(self);
                };
            }
            self.timeout = setTimeout(f, 100);
            if (self.settings.preview) {
                self.$preview.find('p').css('background', self.color.hex);
            }
        }
    }
    function ColorPicker_save(self) {
        var str = "";
        if (typeof self.settings.color2str == 'function') {
            str = self.settings.color2str.apply(null, [self.color]);
        } else {
            str = self.color.hex;
        }
        if (typeof self.settings.save == 'function') {
            self.settings.save.apply(self.$source[0], [str]);
        } else {
            self.$source.val(
                str
            ).html(
                str
            );
        }
    }
    function ColorPicker_load(self) {
        var str;
        if (typeof self.settings.load == 'function') {
            str = self.settings.load.call(self.$source);
        } else {
            str = self.$source.val() || self.$source.html();
        }
        if (typeof self.settings.str2color == 'function') {
            self.color = new Color(self.settings.str2color.apply(null, [str]));
        } else {
            self.color = new Color(str);
        }
        if (self.settings.preview && self.$preview) {
            self.$preview.find('p').css('background', self.color.hex);
        }
    }
    function ColorPicker_show(self, speed) {
        if (! self.ready) {
            ColorPicker_drawAll(self);
        } else {
            ColorPicker_load(self);
            ColorPicker_drawSaturationLimunositySelector(self);
            ColorPicker_drawIndicators(self);
        }
        if (! speed) {
            speed = self.settings.speed;
        }
        ColorPicker_fixPosition(self);
        self.$source.trigger('beforeShow.' + NAMESPACE);
        var effect = self.effect == 'fade' ? 'fadeIn' : 'slideDown';
        self.$container[effect].apply(
            self.$container,
            [
                speed,
                function () {
                    self.$source.trigger('show.' + NAMESPACE);
                }
            ]
        );
    }
    function ColorPicker_hide(self, speed) {
        if (! speed) {
            speed = self.settings.speed;
        }
        self.$source.trigger('beforeHide.' + NAMESPACE);
        var effect = self.effect == 'fade' ? 'fadeOut' : 'slideUp';
        self.$container[effect].apply(
            self.$container,
            [
                speed,
                function () {
                    self.$source.trigger('hide.' + NAMESPACE);
                }
            ]
        );
    }
    function ColorPicker_handleSatLumDrag(self, e) {
        var offset = self.$picker.offset();
        var degrees = (1 - self.color.hsl.h) * Math.PI * 2;
        var points = ColorPicker_getPoints(self, degrees);
        var inputPoint = getEventPosition(self, e, self.$picker);
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
                    sanitisedInputPoint = ColorPicker_sanitiseDragInput(inputPoint, points, distances, i);
                    break;
                }
            }
        }
        var color = ColorPicker_getSatLumColor(points[0], points[1], points[2], sanitisedInputPoint, self.color.hsl.h);
        ColorPicker_reDrawSatLum(
            self,
            color.s,
            color.l
        );
    }
    function ColorPicker_sanitiseDragInput(inputPoint, points, distances, index) {
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
    function ColorPicker_getSatLumColor(point1, point2, point3, inputPoint, hue) {
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
    function ColorPicker_drawAll(self) {
        ColorPicker_drawHueSelector(self);
        ColorPicker_drawSaturationLimunositySelector(self);
        ColorPicker_drawIndicators(self);
        self.ready = 1;
        self.$source.trigger('ready.' + NAMESPACE);
    }
    /** The color picker object */
    var ColorPicker = function ($this, settings) {
        var self = this;
        /**
        * Properties
        */
        self.ready = 0;
        self.settings = settings;
        self.draggingHue = 0;
        self.draggingSatLum = 0;
        self.resizing = 0;
        self.drawing = 0;
        self.$source = $this;
        ColorPicker_load(self); // sets self.color
        self.diameter = ColorPicker_fixDiameter(self.settings.diameter);
        self.widthRatio = self.settings.width / 3;
        self.shadowRatio = self.settings.shadow / self.diameter;
        self.triangleRadius = self.diameter / 2 - 10 - self.widthRatio * self.diameter;
        var canvasString = '<canvas width="' + self.diameter + '" height="' + self.diameter + '"></canvas>';
        if (self.settings.target) {
            self.$target = $(self.settings.target);
        }
        if (! self.$target || ! self.$target.length) {
            self.$target = $('<div/>')
                .prependTo('body')
                .css({
                    width: 0,
                    height: 0,
                    position:'absolute',
                    overflow:'visible'
                });
        }
        self.$picker = $('<div/>')
            .css({
                position:'relative'
            })
            .width(self.diameter)
            .height(self.diameter)
            .html(
                canvasString + canvasString + canvasString
            );

        self.$container = $('<div/>')
            .append(self.$picker)
            .width(self.diameter)
            .css({
                position:'absolute',
                'z-index':self.settings.zIndex
            });
        self.$preview = $('<p />')
            .css({
                margin: 0,
                padding: '10px 10px 0 10px'
            })
            .append(
                $('<p />')
                    .css({
                        margin:0,
                        height: self.settings.previewHeight + 'px',
                        width: '100%',
                        background: self.color.hex
                    })
            );

        if (self.settings.preview) {
            self.$container.prepend(
                self.$preview
            );
        }

        if (self.settings.class) {
            self.$container.attr('class',self.settings.class)
        } else {
            var borderRadius = '0px 0px 0px ' + self.diameter/2 + 'px';
            if (! self.settings.resizable) {
                borderRadius = '0px 0px ' + self.diameter/2 + 'px ' + self.diameter/2 + 'px';
            }
            var borderColor = '1px solid rgba(82,37,18,0.5)';
            self.$container.css({
                background:'rgba(228,204,193,0.8)',
                'border-bottom':borderColor,
                'border-left':borderColor,
                'border-right':borderColor,
                '-webkit-border-radius': borderRadius,
                'border-radius': borderRadius
            });
        }
        // adjust diamtere to account for borders
        self.diameter -= parseInt(
            parseInt(self.$container.css('border-left-width'), 10)
            + parseInt(self.$container.css('border-right-width'), 10),
            10
        ) || 0;
        self.$picker
            .height(self.diameter)
            .add(self.$container)
            .width(self.diameter)

        self.$target.append(
            self.$container
                .hide()
        );
        self.canvases = self.$picker.find('canvas')
            .css({
                position:'absolute',
                width:'100%',
                height:'100%'
            });
        self.tempCanvas = $(canvasString)[0];

        self.effect = 'fade';
        if (self.settings.effect == 'slide') {
            self.effect = 'slide';
        }


        if (! self.settings.autoshow) {
            ColorPicker_drawAll(self);
        } else {
            self.$source.mouseover(function () {
                ColorPicker_drawAll(self);
                self.$source.unbind('mouseover');
            }).bind('focus click', function () {
                if (! self.ready) {
                    ColorPicker_drawAll(self);
                }
                ColorPicker_show(self);
            }).blur(function () {
                ColorPicker_hide(self);
            });
        }
        /**
        * Register events
        */
        self.$source.keyup(function () {
            self.$source.trigger('update.' + NAMESPACE);
            ColorPicker_load(self);
            ColorPicker_drawSaturationLimunositySelector(self);
            ColorPicker_drawIndicators(self);
        }).keydown(function (e) {
            if (e.keyCode == 27) {
                ColorPicker_hide(self);
            }
        });
        self.$container.bind('mousedown touchstart', function (e) {
            preventDefault(e)
            var lineWidth = self.widthRatio * self.diameter / 2;
            var circleRadius = (self.diameter / 2) - (lineWidth/2) - lineWidth;
            var offset = self.$picker.offset();
            var inputPoint = getEventPosition(self, e, self.$picker);
            if (self.settings.resizable
                && inputPoint[0] > self.diameter-20
                && inputPoint[1] > self.diameter-20
            ) {
                self.resizing = 1;
            } else {
                if (
                    pointInCircle(inputPoint, self.diameter/2, circleRadius+lineWidth)
                    &&
                    ! pointInCircle(inputPoint, self.diameter/2, circleRadius-lineWidth)
                ) {
                    self.draggingHue = 1;
                    ColorPicker_reDrawHue(self, e);
                } else {
                    var degrees = (1 - self.color.hsl.h) * Math.PI * 2;
                    var points = ColorPicker_getPoints(self, degrees);
                    if (pointInTriangle(inputPoint, points[0], points[1], points[2])) {
                        self.draggingSatLum = 1;
                        ColorPicker_handleSatLumDrag(self, e);
                    }
                }
            }
        });
        $([window, document]).bind('mousemove touchmove', function (e) {
            if (self.draggingHue) {
                preventDefault(e)
                ColorPicker_reDrawHue(self, e);
            } else if (self.draggingSatLum) {
                preventDefault(e)
                ColorPicker_handleSatLumDrag(self, e);
            } else if (self.resizing) {
                preventDefault(e)
                var inputPoint = getEventPosition(self, e, self.$picker);
                var newDiameter = ColorPicker_fixDiameter(
                    Math.max(inputPoint[0], inputPoint[1])
                );
                self.$container.width(newDiameter).height(
                    newDiameter + self.$preview.outerHeight()
                );
                self.$picker.width(newDiameter).height(newDiameter);

                var borderRadius = '0px 0px 0px ' + newDiameter/2 + 'px';
                if (! self.settings.resizable) {
                    borderRadius = '0px 0px ' + newDiameter/2 + 'px ' + newDiameter/2 + 'px';
                }
                self.$container.css({
                    '-webkit-border-radius': borderRadius,
                    'border-radius': borderRadius
                });
            }
        }).bind('mouseup touchend', function (e) {
            if (self.draggingHue) {
                preventDefault(e)
                self.draggingHue = 0;
                ColorPicker_reDrawHue(self, e);
            } else if (self.draggingSatLum) {
                preventDefault(e)
                self.draggingSatLum = 0;
                ColorPicker_handleSatLumDrag(self, e);
            } else if (self.resizing) {
                preventDefault(e)
                self.resizing = 0;
                ColorPicker_resize(self, self.$picker.width());
            }
        }).bind('resize', function () {
            ColorPicker_fixPosition(self);
        });
    };

    function preventDefault(e) {
        e.preventDefault();
    }

    function ColorPicker_fixDiameter(diameter) {
        diameter = diameter | 0;
        diameter = diameter + diameter % 2;
        if (diameter > 400) {
            diameter = 400;
        } else if (diameter < 100) {
            diameter = 100;
        }
        return diameter;
    }
    function ColorPicker_fixPosition(self) {
        if (! self.settings.target) {
            var offset = self.$source.offset();
            self.$target.css({
                top: 0,
                left: 0
            });
            self.$container.css({
                top: offset.top + self.$source.outerHeight(),
                left: offset.left
            });
        }
    }

    function getEventPosition(self, e, $obj) {
        var x = 0, y = 0;
        var oe = e.originalEvent;
        var touch = oe.touches || oe.changedTouches;
        var offset = $obj.parent().offset();
        if (touch) {
            // touchscreen
            x = touch[0].pageX - offset.left;
            y = touch[0].pageY - offset.top - self.$preview.outerHeight();
        } else if (e.pageX /*&& this.mouse*/) {
            // mouse
            x = e.pageX - offset.left;
            y = e.pageY - offset.top - self.$preview.outerHeight();
        } else {
            // a mouse event being fired during a touch swipe
            // This seems to be an Android bug
            // FIXME: need to handle this error :(
        }
        return [x, y];
    }

    function ColorPicker_resize(self, diameter) {
        if (diameter != self.diameter) {
            self.ready = 0;
            self.diameter = diameter;
            self.triangleRadius = diameter / 2 - 10 - self.widthRatio * diameter;
            self.canvases
                .each(function () {
                    this.width = diameter;
                    this.height = diameter;
                })
                .add(self.$container);
            self.tempCanvas.width = diameter;
            self.tempCanvas.height = diameter;
            ColorPicker_drawAll(self);
            self.$source.trigger('resize.' + NAMESPACE);
        }
    }

    var methods = {
        init: function(options) {
            var settings = $.extend(
                {},
                defaults,
                options
            );
            return this.each(function () {
                var $this = $(this);
                if (! $this.data(NAMESPACE)) {
                    // Instantiate new ColorPicker
                    $this.data(NAMESPACE, new ColorPicker($this, settings));
                    // Register callbacks for all events
                    var i, events = [
                        'create',
                        'ready',
                        'update',
                        'destroy',
                        'show',
                        'hide',
                        'beforeShow',
                        'beforeHide',
                        'resize'
                    ];
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
                    $this.trigger('create.' + NAMESPACE);
                 }
            });
        },
        show: function (speed) {
            return this.each(function () {
                ColorPicker_show($(this).data(NAMESPACE), speed);
            });
        },
        hide: function (speed) {
            return this.each(function () {
                ColorPicker_hide($(this).data(NAMESPACE), speed);
            });
        },
        save: function() {
            return this.each(function () {
                ColorPicker_save($(this).data(NAMESPACE));
            });
        },
        setColor: function (value) {
            return this.each(function () {
                var self = $(this).data(NAMESPACE);
                self.color.setColor(value);
                ColorPicker_drawSaturationLimunositySelector(self);
                ColorPicker_drawIndicators(self);
                ColorPicker_setValue(self);
            });
        },
        getColor: function () {
            return this.data(NAMESPACE).color;
        },
        resize: function (diameter) {
            return this.each(function () {
                ColorPicker_resize($(this).data(NAMESPACE), diameter)
            });
        },
        api: function () {
            var retval = {}, that = this;
            retval.show     = function (speed) { methods.show.apply(that, [speed]); return this; };
            retval.hide     = function (speed) { methods.hide.apply(that, [speed]); return this; };
            retval.save     = function ()      { methods.save.call(that); return this; };
            retval.getColor = function ()      { return methods.getColor.call(that); };
            retval.setColor = function (color) { methods.setColor.apply(that, [color]); return this; };
            retval.destroy  = function ()      { methods.destroy.call(that); };
            retval.resize   = function (size)  { methods.resize.apply(that, [size]); return this; };
            return retval;
        },
        destroy: function () {
            return this.each(function () {
                var self = $(this).data(NAMESPACE)
                if ($(self.settings.target).length){
                    if (self.$container.siblings().length) {
                        self.$container.remove();
                    } else {
                        self.$target.remove();
                    }
                } else {
                    self.$target.remove();
                }
                $(this)
                .removeData(NAMESPACE)
                .trigger('destroy.' + NAMESPACE)
                .unbind('.' + NAMESPACE);
            });
        }
    };

    /** Extend jQuery */
    $.fn[NAMESPACE] = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.' + NAMESPACE);
        }
    };
})(jQuery, document, window, Math, {
    autoshow:      true,     // bool
    autosave:      true,    // bool
    speed:         400,     // post int | 'fast' | 'slow' | 'medium'
    diameter:      180,     // pos int
    width:         0.35,    // float
    resizable:     true,    // bool
    class:         null,    // string
    shadow:        0,        // float
    preview:       true,    // bool
    previewHeight: 25,      // pos int
    effect:        'fade',  // 'fade' | 'slide'
    zIndex:        4000
    /*
    ,
    target:     null,

    create:     undefined,
    ready:      undefined,
    destroy:    undefined,
    update:     undefined,
    beforeShow: undefined,
    show:       undefined,
    beforeHide: undefined,
    hide:       undefined,
    resize:     undefined,

    save:       undefined,
    load:       undefined,
    str2color:  undefined,
    color2str:  undefined
    */
});
