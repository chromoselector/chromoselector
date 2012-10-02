/**
 * TODO:
 *
 * v 1.0.0:
 *   Fix positioning issues
 *   CMYK and HSV colors
 *   Alpha selection
 *   Basic resizing
 *   Add missing event triggers
 *
 * v 1.1.0:
 *   IE 6+ support
 *   better performance rendering colorwheel
 *   shorter code
 */
(function ($, document, defaults) {
    "use strict";
    /**
     * Shorten names of math functions
     */
    var m = Math;
    var Math_cos = m.cos;
    var Math_sin = m.sin;
    var Math_round = m.round;
    var Math_sqrt = m.sqrt;
    var Math_abs = m.abs;
    var Math_min = m.min;
    var Math_max = m.max;
    var Math_PI = m.PI;
    var Math_atan2 = m.atan2;
    var Math_ceil = m.ceil;
    /**
     * COLOR MANAGEMENT
     */
    function Color(value) {
        var self = this;
        self.rgb = { r:0, g:0, b:0 };
        self.hsl = { h:0, s:0, l:0 };
        self.hex = "#000000";
        self.setColor(value);
    };
    // Shorten references to prototype
    Color.p = Color.prototype;
    // setters
    Color.p.setColor = function(value) {
        var self = this;
        if (typeof value == 'string') {
            this.setHex(value);
        } else if (typeof value == 'object') {
            var haveFields = function (value, fields) {
                for (var i in fields.split('')) {
                    if (typeof value[fields[i]] == 'undefined') { // value validation
                        return false;
                    }
                }
                return true;
            };
            if (haveFields(value, 'hsl')) {
                self.setHsl(value);
            } else if (haveFields(value, 'rgb')) {
                self.setRgb(value);
            } else if (typeof value.hsl == 'object') {
                self.setColor(value.hsl);
            } else if (typeof value.rgb == 'object') {
                self.setColor(value.rgb);
            }
        }
        return self;
    }
    Color.p.setRgb = function(value) {
        var self = this;
        self.rgb = value;
        self.hsl = Color_rgb2hsl(value);
        self.hex = Color_rgb2hex(value);
        return self;
    }
    Color.p.setHsl = function(value) {
        var self = this;
        value.h = value.h - Math.floor(value.h);
        if (value.h < 0) {
            value.h = 1 + value.h;
        }
        self.hsl = value;
        self.rgb = Color_hsl2rgb(value);
        self.hex = Color_rgb2hex(self.rgb);
        return self;
    }
    Color.p.setHex = function(value) {
        var self = this;
        var r = /^#([0-9a-f]{3}){1,2}$/i;
        if (r.test(value)) {
            if (value.length === 4) {
                value = value.replace(/[0-9a-f]/gi, function(match) {
                    return match + match;
                });
            }
            self.hex = value;
            self.rgb = Color_hex2rgb(value);
            self.hsl = Color_rgb2hsl(self.rgb);
        }
        return self;
    }

    // converters
    function Color_rgb2hsl(value) {
        var r = value.r,
        g = value.g,
        b = value.b,
        max = Math_max(r, g, b),
        min = Math_min(r, g, b),
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
    function Color_rgb2hex(value) {
        var convert = function (value) {
            value = Math_round(value * 255);
            var retval = value.toString(16);
            if (value < 16) {
                retval = "0" + retval;
            }
            return retval;
        };
        return "#" + convert(value.r) + convert(value.g) + convert(value.b);
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
    function Color_hex2rgb(value) {
        var convert = function (v) {
            return parseInt('0x' + v, 16) / 255;
        };
        return {
            r: convert(value.substring(1,3)),
            g: convert(value.substring(3,5)),
            b: convert(value.substring(5,7))
        };
    }

    /**
     * 2D MATHS
     */
    function roundPoint(point) {
        return [
            Math_round(point[0]),
            Math_round(point[1])
        ];
    }
    function getPointOnCircle(radius, degrees, offset) {
        return [
            offset + (radius * Math_cos(degrees)),
            offset + (radius * Math_sin(degrees))
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
        return Math_sqrt(
            (p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1])
        );
    }
    function pointOnLine(point, slope) {
        if (Math_abs(slope) === Infinity) {
            return [
                point[0],
                point[1] + 100
            ];
        }
        return [
            point[0] + 100,
            slope * 100 + point[1]
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
        var index = (x + y * imageData.width) * 4;
        for (var i=0; i<4; i++) {
            imageData.data[index+i] = pixel[i];
        }
    }

    /**
     * the following function is simplified
     * to account for the mask always being
     * straight relative to the x-axis
     */
    function getLumAlphaColor(point1, point2, point3, inputPoint) {
        var alphaIntersectionPoint = intersectLineLine(
            inputPoint,
            point1,
            point2,
            point3
        );
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
        var a = (getDistance(point1, inputPoint) / getDistance(point1, alphaIntersectionPoint)) * 255;
        if (a < 0) {
            a = 0;
        } else if (a > 255) {
            a = 255;
        }
        return [ l, l, l, a ];
    }

    /**
     * Draws the rainbow wheel
     */
    function ColorPicker_drawHueSelector(self) {
        var diameter = self.diameter;
        var ctx = self.canvases[0].getContext("2d");
        var imageData = ctx.createImageData(diameter, diameter);
        var lineWidth = 18;
        var blur = 10;
        var circleRadius = (diameter / 2) - 15;
        var degree, i, j, x, y, r, g, b, rad2deg = (180/Math_PI);
        var origin = [self.diameter / 2, self.diameter / 2];
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
        var drawPart = function (startX, endX, startY, endY) {
            for (i = startX; i < endX; i++) {
                x = i - origin[0];
                for (j = startY; j < endY; j++) {
                    y = j - origin[1];
                    degree = Math_atan2(x, y) * rad2deg + 270;
                    r = getValue(degree + 120);
                    g = getValue(degree);
                    b = getValue(degree + 240);
                    setPixel(imageData, i, j, [r, g, b, 255]);
                }
            }
        };
        var deg = Math_PI*5/4;
        var radius = circleRadius - lineWidth / 2 - 2;
        var squarePoint1 = roundPoint(getPointOnCircle(radius, deg, diameter/2));
        var squarePoint2 = roundPoint(getPointOnCircle(radius, deg + Math_PI,  diameter/2));

       // drawPart(0, diameter, 0, diameter)
        drawPart(0, diameter, 0, squarePoint1[1]);
        drawPart(0, diameter, squarePoint2[1], diameter);
        drawPart(0, squarePoint1[0], squarePoint1[1], diameter - squarePoint1[1]);
        drawPart(squarePoint2[0], diameter, squarePoint1[1], diameter - squarePoint1[1]);

        // copy the image data back onto the canvas
        ctx.putImageData(imageData, 0, 0); // at coords 0,0
        // cut out doughnut
        /** webkit bug prevents usage of "destination-in" */
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius - 8, 0, Math_PI*2, false);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = circleRadius * 2 - 16;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius * 2, 0, Math_PI*2, false);
        ctx.closePath();
        ctx.stroke();
        // shadow
       /* ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = blur;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.arc(origin[0], origin[1], circleRadius, 0, Math_PI*2, false);
        ctx.closePath();
        ctx.fill();
        */
        ctx.globalCompositeOperation = "source-over";
    }

    /**
     * Draws the triangular selector
     */
    function ColorPicker_drawSaturationLimunositySelector(self) {
        var hue = self.color.hsl.h;
        var canvas = self.canvases[1];
        var ctx = canvas.getContext("2d");
        var degrees = -Math_PI / 2;
        var points = ColorPicker_getPoints(self, degrees);
        var tempCtx;
        if (! self.ready) {
            var maskImageData = ctx.createImageData(self.diameter, self.diameter);
            // triangle limits
            var limits = function (points, axis) {
                return {
                    start: Math_round(Math_min(points[0][axis] - 2, points[1][axis] - 2, points[2][axis] - 2)),
                    end: Math_round(Math_max(points[0][axis] + 2, points[1][axis] + 2, points[2][axis] + 2))
                };
            };
            var limitX = limits(points, 0);
            var limitY = limits(points, 1);
            // draw
            for (var i = limitX.start; i <= limitX.end; i++) {
                for (var j = limitY.start; j <= limitY.end; j++) {
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
        }

        degrees = (1 - hue) * Math_PI * 2;
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
        ctx.rotate(degrees + Math_PI / 2);
        ctx.translate(-self.diameter/2, -self.diameter/2);
        ctx.drawImage(self.tempCanvas, 0, 0);
        ctx.restore();
        // cut out triangle
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.closePath();
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();
        // shadow
       /* ctx.beginPath();
        ctx.globalCompositeOperation = "destination-over";
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.lineTo(points[1][0], points[1][1]);
        ctx.lineTo(points[2][0], points[2][1]);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fill();*/
        ctx.globalCompositeOperation = "source-over";
    }

    function ColorPicker_drawIndicators(self) {
        var canvas = self.canvases[2];
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,self.diameter, self.diameter);
        var degrees = (1 - self.color.hsl.h) * Math_PI * 2;
        var points = ColorPicker_getPoints(self, degrees);
        /** draw hue indicator */
        var indicator = getPointOnCircle(self.diameter / 2 - 15, degrees, self.diameter / 2);
        ctx.strokeStyle = "rgba(1,1,1,1)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(indicator[0], indicator[1], 4, 0, Math_PI*2, false);
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
        ctx.arc(colorPoint[0], colorPoint[1], 4, 0, Math_PI*2, false);
        ctx.closePath();
        ctx.stroke();
        setTimeout(function () {
            self.drawing = false;
        }, 4);
    }

    /** The color picker functions */
    function ColorPicker_getPoints(self, hue) {
        var points = [];
        for (var i = 0; i < 3; i++) {
            points[i] = getPointOnCircle(
                self.triangleRadius,
                hue,
                self.diameter / 2
            );
            hue -= Math_PI * 2 / 3;
        }
        return points;
    }
    function ColorPicker_reDrawHue(self, e) {
        var offset = self.$picker.offset();
        var angle = Math_atan2(
            e.pageX - offset.left - self.diameter / 2,
            e.pageY - offset.top - self.diameter / 2
        ) * (180/Math_PI) + 270;
        self.color.setHsl({
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
        self.drawing = true;
        ColorPicker_setValue(self);
    }
    function ColorPicker_reDrawSatLum(self, s, l) {
        self.color.setHsl({
            h: self.color.hsl.h,
            s: s,
            l: l
        });
        ColorPicker_drawIndicators(
            self
        );
        self.drawing = true;
        ColorPicker_setValue(self);
    }
    function ColorPicker_setValue(self) {
        if (! self.timeout) {
            self.$source.trigger('update.canvasColorPicker');
            var f = function () {
                self.timeout = false;
            };
            if (self.settings.autosave) {
                f = function () {
                    self.timeout = false;
                    ColorPicker_save(self);
                };
            }
            self.timeout = setTimeout(f, 100);
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
            return self.settings.str2color.apply(null, [str]);
        }
        return new Color(str);
    }
    function ColorPicker_show(self, speed) {
        if (! self.ready) {
            ColorPicker_drawAll(self);
        }
        if (! speed) {
            speed = self.settings.speed;
        }
        self.$source.trigger('beforeShow.canvasColorPicker');
        self.$picker.fadeIn(speed, function () {
            self.$source.trigger('show.canvasColorPicker');
        });
    }
    function ColorPicker_hide(self, speed) {
        if (! speed) {
            speed = self.settings.speed;
        }
        self.$source.trigger('beforeHide.canvasColorPicker');
        self.$picker.fadeOut(speed, function () {
            self.$source.trigger('hide.canvasColorPicker');
        });
    }
    function ColorPicker_handleSatLumDrag(self, e) {
        var offset = self.$picker.offset();
        var degrees = (1 - self.color.hsl.h) * Math_PI * 2;
        var points = ColorPicker_getPoints(self, degrees);
        var inputPoint = [
            e.pageX - offset.left,
            e.pageY - offset.top
        ];
        var sanitisedInputPoint = inputPoint;
        if (! pointInTriangle(inputPoint, points[0], points[1], points[2])) {
            var i, distances = [];
            for (i=0; i<3; i++) {
                distances[i] = getDistance(
                    points[i],
                    inputPoint
                );
            }
            var maxDistance = Math_max.apply(null, distances);
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
            var minDistance = Math_min.apply(null, distances);
            for (var i=0; i<3; i++) {
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
        self.ready = true;
        self.$source.trigger('ready.canvasColorPicker');
    }
    /** The color picker object */
    var ColorPicker = function ($this, settings) {
        var self = this;
        /**
        * Properties
        */
        self.ready = false;
        self.settings = settings;
        self.draggingHue = false;
        self.draggingSatLum = false;
        self.drawing = false;
        self.$source = $this;
        self.color = ColorPicker_load(self);
        self.diameter = self.settings.diameter;
        self.triangleRadius = self.diameter / 2 - 30;
        var canvasString = '<canvas width="' + self.diameter + '" height="' + self.diameter + '"></canvas>';
        var $target;
        if (self.settings.target) {
            $target = $(self.settings.target);
        }
        if (! $target || ! $target.length) {
            $target = $('<div/>').appendTo('body').css({
                top: self.$source.offset().top + self.$source.height() + 5,
                left: self.$source.offset().left
            })
            .width(0)
            .height(0)
            .css('position', 'absolute');
        }
        self.$picker = $('<div/>').width(self.diameter).height(self.diameter);
        $target.append(
            self.$picker
                .hide()
                .html(
                    canvasString + canvasString + canvasString
                )
        );
        self.canvases = self.$picker.find('canvas').css('position', 'absolute');
        self.tempCanvas = $(canvasString)[0];

        if (! self.settings.autoshow) {
            ColorPicker_drawAll(self);
        } else {
            self.$source.mouseover(function () {
                ColorPicker_drawAll(self);
                self.$source.unbind('mouseover');
            }).focus(function () {
                if (! self.ready) {
                    ColorPicker_drawAll(self);
                }
                ColorPicker_show(self);
            }).blur(function () {
                if (self.settings.autoshow) {
                    ColorPicker_hide(self);
                }
            });
        }
        /**
        * Register events
        */
        self.$picker.bind('mousedown', function (e) {
            e.preventDefault();
            var radius = self.diameter/2 - 15;
            var offset = self.$picker.offset();
            var inputPoint = [
                e.pageX - offset.left,
                e.pageY - offset.top
            ];
            var lineWidth = 9;
            if (
                pointInCircle(inputPoint, self.diameter/2, radius+lineWidth)
                &&
                ! pointInCircle(inputPoint, self.diameter/2, radius-lineWidth)
            ) {
                self.draggingHue = true;
                ColorPicker_reDrawHue(self, e);
            } else {
                var degrees = (1 - self.color.hsl.h) * Math_PI * 2;
                var points = ColorPicker_getPoints(self, degrees);
                if (pointInTriangle(inputPoint, points[0], points[1], points[2])) {
                    self.draggingSatLum = true;
                    ColorPicker_handleSatLumDrag(self, e);
                }
            }
        });
        $([window, document]).bind('mousemove', function (e) {
            e.preventDefault();
            if (self.draggingHue) {
                ColorPicker_reDrawHue(self, e);
            } else if (self.draggingSatLum) {
                ColorPicker_handleSatLumDrag(self, e);
            }
        }).bind('mouseup', function (e) {
            e.preventDefault();
            if (self.draggingHue) {
                self.draggingHue = false;
                ColorPicker_reDrawHue(self, e);
            }
            if (self.draggingSatLum) {
                self.draggingSatLum = false;
                ColorPicker_handleSatLumDrag(self, e);
            }
        });
    };

    var methods = {
        init: function(options) {
            var settings = $.extend(
                defaults,
                options
            );

            return this.each(function () {
                var $this = $(this);
                if (! $this.data('canvasColorPicker')) {
                    $this.data('canvasColorPicker', 1);
                    // Instantiate new ColorPicker
                    $this.data('self', new ColorPicker($this, settings));
                    // Register callbacks for all events
                    var events = [
                        'create',
                        'ready',
                        'update',
                        'destroy',
                        'show',
                        'hide',
                        'beforeShow',
                        'beforeHide'
                    ];
                    for (var i in events) {
                        var name = events[i];
                        var data = settings[name];
                        if (typeof data === 'function') {
                            $this.bind(
                                name + '.canvasColorPicker',
                                data
                            );
                        }
                    }
                    $this.trigger('create.canvasColorPicker');
                 }
            });
        },
        show: function (speed) {
            return this.each(function () {
                ColorPicker_show($(this).data('self'), speed);
            });
        },
        hide: function (speed) {
            return this.each(function () {
                ColorPicker_hide($(this).data('self'), speed);
            });
        },
        save: function() {
            return this.each(function () {
                var self = $(this).data('self');
                ColorPicker_save(self);
            });
        },
        setColor: function (value) {
            return this.each(function () {
                $(this).data('self').color.setColor(value);
            });
        },
        getColor: function () {
            return this.data('self').color;
        },
        api: function () {
            var retval = {};
            var that = this;
            retval.show     = function (speed) { methods.show.apply(that, [speed]); return this; };
            retval.hide     = function (speed) { methods.hide.apply(that, [speed]); return this; };
            retval.save     = function ()      { methods.save.call(that); return this; };
            retval.getColor = function ()      { return methods.getColor.call(that); };
            retval.setColor = function (color) { methods.setColor.apply(that, [color]); return this; };
            retval.destroy  = function ()      { methods.destroy.call(that); };
            return retval;
        },
        destroy: function () {
            return this.each(function () {
                var self = $(this).data('self')
                if ($(self.settings.target).length) {
                    self.$picker.remove();
                } else {
                    self.$picker.parent().remove();
                }
                $(this)
                .removeData('canvasColorPicker')
                .removeData('self')
                .trigger('destroy.canvasColorPicker')
                .unbind('.canvasColorPicker');
            });
        }
    };

    /** Extend jQuery */
    $.fn.canvasColorPicker = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.canvasColorPicker');
        }
    };
})(jQuery, document, {
    autoshow:   true,
    autosave:   true,
    speed:      400,
    diameter:   210,
    target:     null,

    create:     undefined,
    ready:      undefined,
    destroy:    undefined,
    update:     undefined,
    beforeShow: undefined,
    show:       undefined,
    beforeHide: undefined,
    hide:       undefined,

    save:       undefined,
    load:       undefined,
    str2color:  undefined,
    color2str:  undefined
});
