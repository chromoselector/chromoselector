/**
 * ChromoSelector 1.0.0 for jQuery 1.3+
 *
 * TODO:
 *   Documentation
 *   converters code
 *
 * v 1.1.0:
 *   Improved mobile support
 *   Dialog mode
 *   HSV support
 *   Alpha selection
 *   Side panel
 *   Better slide animation
 *   refactor hue2rgb
 *   Faster shadow - rotate instead of blurring
 *   shorter code
 */
(function ($, window, Math, defaults) {
    "use strict";
    var document = window.document;
    /**
     * NAMESPACE for events and data
     */
    var NAMESPACE = 'chromoselector';

    /**
     * Time management for rendering
     */
    function Renderer(picker, callback, delay) {
        var self = this;
        self.picker = picker;
        self.callback = callback;
        self.delay = delay || 8;
        // self.saved = undefined;
        self.busy = 0;
    }
    Renderer.prototype.save = function (e) {
        var self = this;
        if (self.busy) {
            self.saved = e;
        } else {
            self.busy = 1;
            self.callback.apply({}, [self.picker, e]);
            self.stop();
        }
    };
    Renderer.prototype.stop = function () {
        // Removes the busy flag asynchronously, this way the event queue
        // can clear up meanwhile. This speeds up rendering.
        var self = this;
        setTimeout(function () {
            if (typeof self.saved == 'undefined') {
                self.busy = 0;
            } else {
                var target = self.saved;
                self.saved = undefined;
                self.callback.apply({}, [self.picker, target]);
                self.stop();
            }
        }, self.delay);
    };

    /**
     * COLOR MANAGEMENT
     */
    var Color = (function () {
        function Color(value) {
            var self = this;
            // default to black
            self.rgb  = { r:0, g:0, b:0 };
            self.hsl  = { h:0, s:0, l:0 };
            self.cmyk = { c:0, m:0, y:0, k:1 };
            self.hex  = "#000000";
            self.setColor(value);
        }
        // setters
        Color.prototype.setColor = function(value) {
            var self = this;
            if (typeof value == 'object' && value) {
                var haveFields = function (value, fields) {
                    for (var i in fields.split('')) {
                        if (typeof value[fields[i]] != 'number'
                            || isNaN(value[fields[i]])
                            || value[fields[i]] < 0
                            || value[fields[i]] > 1
                        ) {
                            return 0;
                        }
                    }
                    return 1;
                };
                if (haveFields(value, 'sl')
                    && typeof value.h == 'number'
                    && ! isNaN(value.h)
                ) {
                    value.h = value.h - Math.floor(value.h);
                    if (value.h < 0) {
                        value.h = 1 + value.h;
                    }
                    setHsl(self, value);
                } else if (haveFields(value, 'rgb')) {
                    setRgb(self, value);
                } else if (haveFields(value, 'cmyk')) {
                    setCmyk(self, value);
                } else {
                    self.setColor(value.hsl)
                        .setColor(value.rgb)
                        .setColor(value.cmyk);
                }
            } else if (typeof value == 'string') {
                setHex(self, value);
            }
            return self;
        };
        function setRgb(self, value) {
            self.rgb = value;
            self.hsl = rgb2hsl(value);
            self.cmyk = rgb2cmyk(value);
            self.hex = rgb2hex(value);
        }
        function setHsl(self, value) {
            self.hsl = value;
            self.rgb = hsl2rgb(value);
            self.cmyk = rgb2cmyk(self.rgb);
            self.hex = rgb2hex(self.rgb);
        }
        function setHex(self, value) {
            if (/^#([0-9a-f]{3}){1,2}$/i.test(value)) {
                if (value.length === 4) {
                    value = value.replace(/[0-9a-f]/gi, function(match) {
                        return match + match;
                    });
                }
                self.hex = value;
                self.rgb = hex2rgb(value);
                self.cmyk = rgb2cmyk(self.rgb);
                self.hsl = rgb2hsl(self.rgb);
            }
        }
        function setCmyk(self, value) {
            self.cmyk = value;
            self.rgb = cmyk2rgb(value);
            self.hsl = rgb2hsl(self.rgb);
            self.hex = rgb2hex(self.rgb);
        }
        // converters
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
                l: l
            };
        }
        function rgb2hex(input) {
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
                b: b
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
                b: 1 - Math.min(1, value.y * (1 - value.k) + value.k)
            };
        }
        return Color;
    })();

    /**
     * 2D MATHS
     */
    function getPointOnCircle(radius, degrees, offset) {
        return [
            offset + (radius * Math.cos(degrees)),
            offset + (radius * Math.sin(degrees))
        ];
    }
    /*function getMidpoint(p1, p2) {
        return [
            (p1[0] + p2[0]) / 2,
            (p1[1] + p2[1]) / 2
        ];
    }*/
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
    function getLuminosity(point1, point2, point3, inputPoint) {
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
        ColorWheelBg: 0
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
        var ctx = self.canvases[0].getContext("2d");
        colorPicker_drawColorWheelBg(self.canvases[0], width);
        var lineWidth = self.ringwidthRatio * width;
        var circleRadius = (width / 2) - 5 - lineWidth / 2;
        var origin = [width / 2, width / 2];
        // cut out doughnut
        /** webkit bug prevents usage of "destination-in" */
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius - (self.ringwidthRatio * width / 2), 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();

        var tempCanvas = $('<canvas/>').attr('width', width).attr('height', width)[0];
        var tempCtx = tempCanvas.getContext('2d');
        tempCtx.fillRect(0,0,600,600);
        tempCtx.globalCompositeOperation = "destination-out";
        tempCtx.beginPath();
        tempCtx.arc(origin[0], origin[1], circleRadius + (self.ringwidthRatio * width / 4), 0, Math.PI*2);
        tempCtx.closePath();
        tempCtx.fill();
        ctx.drawImage(tempCanvas, 0, 0);

        // shadow
        ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = lineWidth / 2;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = self.shadowRatio * width;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius - lineWidth / 8, 0, Math.PI*2);
        ctx.closePath();
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
    }

    /**
     * Draws the triangular selector
     */
    function colorPicker_drawSaturationLimunositySelector(self) {
        var width = self.width;
        var hue = self.color.hsl.h;
        var canvas = self.canvases[1];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,width, width);
        var degrees = -Math.PI / 2;
        var points = colorPicker_getPoints(self, degrees);
        var tempCtx;
        if (! self.ready) {
            var maskImageData = ctx.createImageData(width, width);
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
                        getLuminosity(points[0], points[1], points[2], [i, j])
                    );
                }
            }
            for (i = limitX.start; i <= points[0][0] - 3; i++) {
                for (j = limitY.start - (1.7*(i-points[0][0]) | 0) - 3; j <= limitY.end; j++) {
                    setPixel(
                        maskImageData,
                        i,
                        j,
                        getLuminosity(points[0], points[1], points[2], [i, j])
                    );
                }
            }

            tempCtx = self.tempCanvas.getContext('2d');
            tempCtx.putImageData(maskImageData, 0, 0);

            var lingrad = tempCtx.createLinearGradient(0,limitY.start,0,limitY.end);
            lingrad.addColorStop(1, 'rgba(0,0,0,0)');
            lingrad.addColorStop(0, '#000');
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
        }).hex;
        ctx.fillRect(0,0,width,width);
        // Copy rotated mask
        ctx.save();
        ctx.translate(width/2, width/2);
        ctx.rotate(degrees + Math.PI / 2);
        ctx.translate(-width/2, -width/2);
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
        ctx.lineTo(0, width);
        ctx.lineTo(width, width);
        ctx.lineTo(width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.fill();
        // shadow
        var newPoints = [];
        newPoints[0] = [
            width / 2 * 0.05 + points[0][0] * 0.95,
            width / 2 * 0.05 + points[0][1] * 0.95
        ];
        newPoints[1] = [
            width / 2 * 0.05 + points[1][0] * 0.95,
            width / 2 * 0.05 + points[1][1] * 0.95
        ];
        newPoints[2] = [
            width / 2 * 0.05 + points[2][0] * 0.95,
            width / 2 * 0.05 + points[2][1] * 0.95
        ];
        ctx.globalCompositeOperation = "destination-over";
        ctx.beginPath();
        ctx.moveTo(newPoints[0][0], newPoints[0][1]);
        ctx.lineTo(newPoints[1][0], newPoints[1][1]);
        ctx.lineTo(newPoints[2][0], newPoints[2][1]);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = self.shadowRatio * width;
        ctx.fill();
        ctx.shadowColor = 'rgba(0,0,0,0)';
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
    }

    function colorPicker_drawIndicators(self) {
        var width = self.width;
        var hslColor = self.color.hsl;
        var canvas = self.canvases[2];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,width, width);
        var degrees = (1 - hslColor.h) * Math.PI * 2;
        var points = colorPicker_getPoints(self, degrees);
        /** get hue indicator position */
        var circleRadius = (width / 2) - 5 - (self.ringwidthRatio * width * 2 / 3);
        var indicator = getPointOnCircle(circleRadius, degrees, width / 2);

        /** get draw sat/lum indicator position */
        var colorPoint = [
            (points[1][0] * hslColor.l + (1-hslColor.l) * points[2][0]),
            (points[1][1] * hslColor.l + (1-hslColor.l) * points[2][1])
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
            (thePoint2[0] * hslColor.s + (1-hslColor.s) * thePoint1[0]),
            (thePoint2[1] * hslColor.s + (1-hslColor.s) * thePoint1[1])
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
            ctx.arc(indicators[i][0], indicators[i][1], 6, 0, Math.PI*2);
            ctx.closePath();
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000";
            ctx.beginPath();
            ctx.arc(indicators[i][0], indicators[i][1], 4.5, 0, Math.PI*2);
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
            ctx.moveTo(width-20, width-2);
            ctx.lineTo(width-2, width-20);
            ctx.moveTo(width-13, width-2);
            ctx.lineTo(width-2, width-13);
            ctx.moveTo(width-7, width-2);
            ctx.lineTo(width-2, width-7);
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
            s: self.color.hsl.s,
            l: self.color.hsl.l
        });
        colorPicker_drawSaturationLimunositySelector(
            self
        );
        colorPicker_drawIndicators(
            self
        );
        self.valueRenderer.save(self.color);
    }
    function colorPicker_reDrawSatLum(self, s, l) {
        self.color.setColor({
            h: self.color.hsl.h,
            s: s,
            l: l
        });
        colorPicker_drawIndicators(
            self
        );
        self.valueRenderer.save(self.color);
    }
    function colorPicker_update(self) {
        if (self.settings.autosave) {
            colorPicker_save(self);
        }
        if (self.settings.preview) {
            self.$preview.find('div').css('background', self.color.hex);
        }
        self._source.trigger('update');
    }
    function colorPicker_save(self) {
        var str = "";
        if (typeof self.settings.color2str == 'function') {
            str = self.settings.color2str.apply(null, [self.color]);
        } else {
            str = self.color.hex;
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
    function colorPicker_load(self) {
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
        if (self.settings.preview && self.$preview) {
            self.$preview.find('div').css('background', self.color.hex);
        }
    }
    function colorPicker_show(self, speed) {
        if (! self.ready) {
            colorPicker_drawAll(self);
        } else {
            colorPicker_load(self);
            colorPicker_drawSaturationLimunositySelector(self);
            colorPicker_drawIndicators(self);
        }
        if (! speed) {
            speed = self.settings.speed;
        }
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
    function colorPicker_hide(self, speed) {
        if (! speed) {
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
    }
    function colorPicker_handleSatLumDrag(self, e) {
        var degrees = (1 - self.color.hsl.h) * Math.PI * 2;
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
        var color = colorPicker_getSatLumColor(points[0], points[1], points[2], sanitisedInputPoint, self.color.hsl.h);
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
    }
    function colorPicker_resizeContainer(self, width) {
        self._container.width(width).height(
            width + self.$preview.outerHeight()
        );
        self._picker.width(width).height(width);
        var borderRadius = '0px 0px 0px ' + width/2 + 'px';
        if (! self.settings.resizable) {
            borderRadius = '0px 0px ' + width/2 + 'px ' + width/2 + 'px';
        }
        self._container.css({
            '-webkit-border-radius': borderRadius,
            'border-radius': borderRadius
        });
    }
    function colorPicker_resize(self, width) {
        if (width !== self.width) {
            self.ready = 0;
            self.width = width;
            self.triangleRadius = width / 2 - 10 - self.ringwidthRatio * width;
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
        var $source = self._source;
        var offset = $source.offset();
        var $icon = self._icon;
        if (! self.settings.target) {
            self._target.css({
                top: 0,
                left: 0
            });
            self._container.css({
                top: offset.top + $source.outerHeight(),
                left: offset.left
            });
        }
        if ($source.is(':visible')) {
            $icon.show().css('top', offset.top + ($source.outerHeight() - $icon.height()) / 2);
            if (self.settings.iconpos === 'left') {
                $icon.css('left', offset.left - $icon.height());
            } else {
                $icon.css('left', offset.left + $source.outerWidth() + 2);
            }
        } else {
            $icon.hide();
        }
    }
    function colorPicker_sanitiseSettingsValue(index, value) {
        var retval;
        if (index === 'ringwidth' && typeof value != 'undefined') {
            var floatValue = parseFloat(value, 10) || 0;
            if (floatValue < .1) {
                retval = .1;
            } else if (floatValue > 1) {
                retval = 1;
            } else {
                retval = floatValue;
            }
        } else if (index === 'effect') {
            retval = value === 'slide' ? 'slide' : 'fade';
        } else if (index === 'iconpos') {
            retval = value === 'left' ? 'left' : 'right';
        } else if (index === 'target' && (value === null || $(value).length)) {
            retval = value;
        } else if (index === 'icon' && typeof value === 'string') {
            retval = value;
        } else if (index.match(/^autoshow|autosave|resizable|preview|true$/)) {
            retval = !!value;
        } else if (index.match(/^speed|width|shadow$/)) {
            var intValue = parseInt(value, 10) || 0;
            retval = intValue > 0 ? intValue : 0;
        } else if (
            typeof value === 'function'
            // FIXME
           /* &&
            defaults.indexOf(value) >= defaults.indexOf('create')*/
        ) {
            retval = value;
        }
        if (retval) {
            return retval;
        } else {
            return defaults[index];
        }
    }
    function getEventPosition(self, e, $obj) {
        var x = 0, y = 0;
        var oe = e.originalEvent;
        var touch = oe.touches || oe.changedTouches;
        var offset = $obj.parent().offset();
        var previewHeight = self.$preview.outerHeight();
        if (touch) {
            // touchscreen
            x = touch[0].pageX - offset.left;
            y = touch[0].pageY - offset.top - previewHeight;
        } else if (e.pageX /*&& this.mouse*/) {
            // mouse
            x = e.pageX - offset.left;
            y = e.pageY - offset.top - previewHeight;
        }/* else {
            // a mouse event being fired during a touch swipe
            // This seems to be an Android bug
            // FIXME: need to handle this error :(
        }*/
        return [x, y];
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
        self.draggingHueRenderer = new Renderer(self, colorPicker_reDrawHue);

        self.draggingSatLum = 0;
        self.draggingSatLumRenderer = new Renderer(self, colorPicker_handleSatLumDrag);

        self.resizing = 0;
        self.resizingRenderer = new Renderer(self, colorPicker_handleResizeDrag);

        self.valueRenderer = new Renderer(self, colorPicker_update, 100);

        self._source = $this;
        colorPicker_load(self); // sets self.color

        var width = colorPicker_fixDiameter(self.settings.width);
        self.width = width;
        self.ringwidthRatio = self.settings.ringwidth / 3;
        self.shadowRatio = self.settings.shadow / width;
        self.triangleRadius = width / 2 - 10 - self.ringwidthRatio * width;
        var canvasString = '<canvas width="' + width + '" height="' + width + '"></canvas>';
        if (self.settings.target) {
            self._target = $(self.settings.target);
        }
        if (! self._target || ! self._target.length) {
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
            .width(width)
            .height(width)
            .html(
                canvasString + canvasString + canvasString
            );

        self._container = $('<div/>')
            .append(self._picker)
            .width(width)
            .addClass('ui-cs-container')
            .css('position','absolute');

        if (self.settings.icon) {
            self._icon = $('<a />', {href: '#', tabindex:'999'})
            .addClass('ui-cs-icon')
            .css('position','absolute')
            .append(
                $('<img/>')
                .attr('src', self.settings.icon)
            );
            self._target.append(self._icon);
        } else {
            self._icon = $([]);
        }

        if (self.settings.resizable) {
            $('<span />')
                .addClass('ui-cs-resizer')
                .width(20)
                .height(20)
                .css({
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px'
                })
                .appendTo(self._container);
        }

        self.$preview = $('<div />')
            .addClass('ui-cs-preview-container')
            .append(
                $('<div />')
                .addClass('ui-cs-preview-widget')
                .css('background', self.color.hex)
            );

        if (self.settings.preview) {
            self._container.prepend(
                self.$preview
            );
        }

        var borderRadius = '0px 0px 0px ' + width/2 + 'px';
        if (! self.settings.resizable) {
            borderRadius = '0px 0px ' + width/2 + 'px ' + width/2 + 'px';
        }
        self._container.css({
            '-webkit-border-radius': borderRadius,
            'border-radius': borderRadius
        });

        self._picker
            .height(width)
            .add(self._container)
            .width(width);

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

        if (! self.settings.autoshow) {
            colorPicker_drawAll(self);
        } else {
            if (self.settings.lazy) {
                self._source.mouseover(function () {
                    colorPicker_drawAll(self);
                    self._source.unbind('mouseover');
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
        }
        /**
        * Register events
        */
        self._source.keyup(function () {
            self._source.trigger('update');
            colorPicker_load(self);
            colorPicker_drawSaturationLimunositySelector(self);
            colorPicker_drawIndicators(self);
        }).keydown(function (e) {
            if (e.keyCode === 27) {
                colorPicker_hide(self);
            }
        });
        self._container.bind('mousedown touchstart', function (e) {
            preventDefault(e);
            var lineWidth = self.ringwidthRatio * width / 2;
            var circleRadius = (width / 2) - (lineWidth/2) - lineWidth;
            var inputPoint = getEventPosition(self, e, self._picker);
            if (self.settings.resizable
                && inputPoint[0] > width-20
                && inputPoint[1] > width-20
            ) {
                self._source.trigger('resizeStart');
                self.resizing = 1;
                self.resizeOffset = [
                    width - inputPoint[0],
                    width - inputPoint[1]
                ];
            } else {
                if (
                    pointInCircle(inputPoint, width/2, circleRadius+lineWidth)
                    &&
                    ! pointInCircle(inputPoint, width/2, circleRadius-lineWidth)
                ) {
                    self.draggingHue = 1;
                    colorPicker_reDrawHue(self, e);
                } else {
                    var degrees = (1 - self.color.hsl.h) * Math.PI * 2;
                    var points = colorPicker_getPoints(self, degrees);
                    if (pointInTriangle(inputPoint, points[0], points[1], points[2])) {
                        self.draggingSatLum = 1;
                        colorPicker_handleSatLumDrag(self, e);
                    }
                }
            }
        });
        $([window, document]).bind('mousemove touchmove', function (e) {
            if (self.draggingHue) {
                preventDefault(e);
                self.draggingHueRenderer.save(e);
            } else if (self.draggingSatLum) {
                preventDefault(e);
                self.draggingSatLumRenderer.save(e);
            } else if (self.resizing) {
                preventDefault(e);
                self.resizingRenderer.save(e);
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
        }, 40);
    };

    var methods = {
        init: function(options) {
            var settings = {};
            options = options ? options : {};
            for (var index in defaults) {
                settings[index] = colorPicker_sanitiseSettingsValue(index, options[index]);
            }
            return this.each(function () {
                var $this = $(this);
                if (! $this.data(NAMESPACE)) {
                    // Instantiate new ColorPicker
                    $this.data(NAMESPACE, new ColorPicker($this, settings));
                    // Register callbacks for all events
                    var i;
                    var events = 'create|ready|update|destroy|show|hide|beforeHide|resize|resizeStart|resizeStop'.split('|');
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
            return this.each(function () {
                colorPicker_show($(this).data(NAMESPACE), speed);
            });
        },
        hide: function (speed) {
            return this.each(function () {
                colorPicker_hide($(this).data(NAMESPACE), speed);
            });
        },
        save: function() {
            return this.each(function () {
                colorPicker_save($(this).data(NAMESPACE));
            });
        },
        setColor: function (value) {
            return this.each(function () {
                var self = $(this).data(NAMESPACE);
                self.color.setColor(value);
                colorPicker_drawSaturationLimunositySelector(self);
                colorPicker_drawIndicators(self);
                colorPicker_setValue(self);
            });
        },
        getColor: function () {
            return this.data(NAMESPACE).color;
        },
        resize: function (width) {
            return this.each(function () {
                var self = $(this).data(NAMESPACE);
                self._source.trigger('resizeStart');
                colorPicker_resize(self, width);
                self._source
                    .trigger('resize')
                    .trigger('resizeStop');
            });
        },
        reflow: function () {
            return this.each(function () {
                colorPicker_fixPosition($(this).data(NAMESPACE));
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
            retval.reflow   = function ()      { methods.reflow.call(that); return this; };
            return retval;
        },
        destroy: function () {
            return this.each(function () {
                var self = $(this).data(NAMESPACE);
                if ($(self.settings.target).length){
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
        if (methods[method]) {
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
    ringwidth:     .33,        // float
    resizable:     true,       // bool
    shadow:        8,          // pos int
    preview:       true,       // bool
    effect:        'fade',     // 'fade' | 'slide'
    icon:          undefined,  // string
    iconpos:      'right',     // string 'left' | 'right'
    lazy:          true,       // bool
    target:        null,       // null, selector, jQuery object

    // events registered with bind() will not be unbound on destroy API call
    create:      undefined,
    ready:       undefined,
    destroy:     undefined,
    update:      undefined,
    show:        undefined,
    beforeHide:  undefined, // if cancelled does not trigger
    hide:        undefined,
    resize:      undefined,
    resizeStart: undefined,
    resizeStop:  undefined,

    save:       undefined,
    load:       undefined,
    str2color:  undefined,
    color2str:  undefined
});
