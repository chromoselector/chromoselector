'use strict';

var Panel = (function () {
    var NAMESPACE = 'chromoselector';

    var Color = require('./color.js');
    var Throttle = require('./throttle.js');
    var Util = require('./util.js');

    // return constructor
    return function(
        $target,
        inputMode,
        inputModes,
        alphaSupport,
        onlyAlpha,
        panelHeight,
        channelWidth,
        channelMargin,
        panelLabels,
        shadowBlur,
        shadowColor
    ) {
        var self = this;
        // Declare functions
        var getPanelWidth = function(){
            var offset = canvasPadding;
            if (alphaSupport) {
                offset += channelWidth+channelMargin;
            }
            if (onlyAlpha) {
                return canvasPadding+channelWidth;
            } else if (mode === 'cmyk') {
                return offset+channelWidth*4+channelMargin*3;
            } else {
                return offset+channelWidth*3+channelMargin*2;
            }
        };
        var toggleColor = function(color, channel, value) {
            var retval = $.extend({}, color);
            retval[channel] = value;
            return new Color(retval);
        };
        var createGradient = function() {
            return ctx.createLinearGradient(
                0, canvasHeight-channelWidth/2-10,
                0, channelWidth/2+10
            );
        };
        var setSimpleGradient = function(color1, color2) {
            lingrad = createGradient();
            lingrad['addColorStop'](0, color1.getHexString());
            lingrad['addColorStop'](1, color2.getHexString());
            ctx['strokeStyle'] = lingrad;
        };
        var setHueGradient = function() {
            lingrad = createGradient();
            lingrad['addColorStop'](0/6, '#f00');
            lingrad['addColorStop'](1/6, '#ff0');
            lingrad['addColorStop'](2/6, '#0f0');
            lingrad['addColorStop'](3/6, '#0ff');
            lingrad['addColorStop'](4/6, '#00f');
            lingrad['addColorStop'](5/6, '#f0f');
            lingrad['addColorStop'](6/6, '#f00');
            ctx['strokeStyle'] = lingrad;
        };
        var setLightnessGradient = function(color) {
            lingrad = createGradient();
            lingrad['addColorStop'](0,   '#000');
            lingrad['addColorStop'](0.5, color.getHexString());
            lingrad['addColorStop'](1,   '#fff');
            ctx['strokeStyle'] = lingrad;
        };
        var setKeyGradient = function(color) {
            lingrad = createGradient();
            lingrad['addColorStop'](0, color.getHexString());
            lingrad['addColorStop'](1, '#000');
            ctx['strokeStyle'] = lingrad;
        };

        var drawPanel = function() {
            ctx.clearRect(0,0,getPanelWidth(),canvasHeight);

            drawShadows();

            var i, color1, color2, lighnessHsl, keyCmyk, cmy;
            var offset = 10;
            var channel = 0;

            var drawChannel = function() {
                ctx.beginPath();
                ctx.moveTo(offset+channelWidth/2, channelWidth/2+10);
                ctx.lineTo(offset+channelWidth/2, canvasHeight-channelWidth/2-10);
                ctx.lineWidth = channelWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            };

            if (alphaSupport) {
                // Draw checkboard background
                var tempCanvas = document.createElement('canvas');
                tempCanvas.height = 10;
                tempCanvas.width = 10;
                var tempCtx = tempCanvas.getContext('2d');
                tempCtx['fillStyle'] = '#ccc';
                tempCtx['fillRect'](0, 0, 10, 10);
                tempCtx['fillStyle'] = '#888';
                tempCtx['fillRect'](0, 0, 5, 5);
                tempCtx['fillRect'](5, 5, 5, 5);
                var pattern = ctx.createPattern(tempCanvas, 'repeat');
                ctx['strokeStyle'] = pattern;
                drawChannel();
                lingrad = createGradient();
                lingrad['addColorStop'](0, new Color(currentColor).setAlpha(0).getRgbaString());
                lingrad['addColorStop'](1, currentColor.getHexString());
                ctx['strokeStyle'] = lingrad;
                drawChannel();
                offset += channelWidth + channelMargin;
                channel = 1;
            }
            if (onlyAlpha) {
                drawIndicators();
            } else if (mode === 'rgb') {
                $.each(indexes, function (i, index) {
                    color1 = toggleColor(currentColor.getRgb(), index, 0);
                    color2 = toggleColor(currentColor.getRgb(), index, 1);
                    setSimpleGradient(
                        color1,
                        color2
                    );
                    drawChannel();
                    offset += channelWidth + channelMargin;
                    channel++;
                });
                drawIndicators(currentColor.getRgb());
            } else if (mode === 'hsl') {
                setHueGradient();
                drawChannel();

                channel++;
                offset += channelWidth + channelMargin;
                color1 = toggleColor(currentColor.getHsl(), 's', 0);
                color2 = toggleColor(currentColor.getHsl(), 's', 1);
                setSimpleGradient(
                    color1,
                    color2
                );
                drawChannel();

                channel++;
                offset += channelWidth + channelMargin;
                lighnessHsl = $.extend({}, currentColor.getHsl());
                lighnessHsl.l = 0.5;
                setLightnessGradient(new Color(lighnessHsl));
                drawChannel();

                drawIndicators(currentColor.getHsl());
            } else if (mode === 'cmyk') {
                $.each('cmy'.split(''), function (i, index) {
                    color1 = toggleColor(currentColor.getCmyk(), index, 0);
                    color2 = toggleColor(currentColor.getCmyk(), index, 1);
                    setSimpleGradient(
                        color1,
                        color2
                    );
                    drawChannel();
                    offset += channelWidth + channelMargin;
                    channel++;
                });
                keyCmyk = $.extend({}, currentColor.getCmyk());
                keyCmyk.k = 0;
                keyCmyk = new Color(keyCmyk);
                setKeyGradient(keyCmyk);
                drawChannel();
                drawIndicators(currentColor.getCmyk());
            }
        };
        var drawIndicators = function(color) {
            var offset = 10, channel, x, y, verticalSpace;
            var indicator = function (color, lineWidth, diameter){
                ctx['strokeStyle'] = color;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.arc(x, y, diameter, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.stroke();
            };
            if (alphaSupport) {
                x = offset + channelWidth/2;
                verticalSpace = canvasHeight - channelWidth - 20;
                y = verticalSpace - (verticalSpace * currentColor.getAlpha()) + channelWidth/2 + 10;
                offset += channelWidth + channelMargin;
                indicator("#fff", 1.5, 6);
                indicator("#000", 2, 4.5);
            }
            if (! onlyAlpha) {
                $.each(color, function (channel, value) {
                    x = offset + channelWidth/2;
                    verticalSpace = canvasHeight - channelWidth - 20;
                    y = verticalSpace - (verticalSpace * value) + channelWidth/2 + 10;
                    indicator("#fff", 1.5, 6);
                    indicator("#000", 2, 4.5);
                    offset += channelWidth + channelMargin;
                });
            }
        };
        var drawShadow = function (x) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.beginPath();
            ctx.moveTo(x, channelWidth/2+10);
            ctx.lineTo(x, canvasHeight-channelWidth/2-10);
            ctx.lineWidth = channelWidth - 2;
            ctx['strokeStyle'] = 'rgba(0,0,0,1)';
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.shadowBlur = 0;
        };
        var drawShadows = function () {
            if (shadowBlur > 0) {
                var x, offset = 10, channel;
                if (alphaSupport) {
                    x = offset + channelWidth/2;
                    drawShadow(x);
                    offset += channelWidth + channelMargin;
                }
                if (! onlyAlpha) {
                    $.each(indexes, function () {
                        x = offset + channelWidth/2;
                        drawShadow(x);
                        offset += channelWidth + channelMargin;
                    });
                }
            }
        };
        var drawLabels = function() {
            var j=0;
            if (alphaSupport || onlyAlpha) {
                $labels.append(
                    $('<div />').text('A').width(channelWidth).css({'padding-left':10})
                );
            } else if (! onlyAlpha) {
                $labels.append(
                    $('<div />').text(indexes[0].toUpperCase()).width(channelWidth).css({'padding-left':10})
                );
                j++;
            }
            if (! onlyAlpha) {
                for (;j<indexes.length;j++) {
                    $labels.append(
                        $('<div />').text(indexes[j].toUpperCase()).width(channelWidth).css({'padding-left':channelMargin})
                    );
                }
            }
        };
        var draggingRenderer = Throttle(function(event) {
            var inputPoint = Util.getEventPosition(false, event, $canvas);
            var fullScaleValue = canvasHeight - channelWidth - canvasPadding;
            var position = fullScaleValue - Math.round(inputPoint[1] - channelWidth/2 - canvasPadding/2);
            if (position < 0) {
                position = 0;
            } else if (position > fullScaleValue) {
                position = fullScaleValue;
            }
            var value = position / fullScaleValue;
            if (alphaSupport && draggingChannel === 0) {
                currentColor.setAlpha(value);
            } else if (! onlyAlpha) {
                var index = draggingChannel;
                if (alphaSupport) {
                    index--;
                }
                var functionToCall = 'get' + mode.charAt(0).toUpperCase() + mode.slice(1);
                var tempColor = currentColor[functionToCall]();
                tempColor[indexes[index]] = value;
                tempColor.a = currentColor.getAlpha();
                currentColor = new Color(
                    tempColor
                );
            }

            drawPanel();
            $target.trigger(NAMESPACE+'.'+NAMESPACE);
        });

        // API
        self.getColor = function () {
            return currentColor;
        };
        self.getWidth = function () {
            return getPanelWidth();
        };
        self.setAlpha = function (value) {
            currentColor.setAlpha(value);
            return self;
        };
        self.setColor = function (newColor) { // Throttle?
            currentColor = new Color(newColor);
            drawPanel();
            return self;
        };
        self.setHeight = function (newHeight) {
            ctx.clearRect(0,0,getPanelWidth(),canvasHeight);
            labelsHeight = $labels.outerHeight(true);
            $select.width(getPanelWidth() - 20);
            canvasHeight = newHeight - $select.outerHeight(true) - labelsHeight;
            $canvas.attr('height', canvasHeight);
            //canvas.height = canvasHeight;
            drawPanel();
            return self;
        };
        self.setMode = function (newMode) {
            if ($.inArray(newMode, allModes) >= 0) {
                $select.val(newMode);
                mode = newMode;
                indexes = newMode.split('');
                $canvas.attr('width', getPanelWidth());
                drawPanel();
                if (panelLabels) {
                    $labels.width(getPanelWidth()).children().remove();
                    drawLabels();
                }
                $select.width(getPanelWidth() - 20);
            }
            return self;
        };

        // Initialise variables. step 1
        var canvasPadding = 20;
        var lingrad;
        var currentColor = new Color();
        var mode = 'rgb';
        var indexes = mode.split('');
        var dragging = 0;
        var draggingChannel = 0;
        var selectHeight = 0;
        var allModes = ['rgb', 'hsl', 'cmyk'];
        var $select = $('<select/>');
        // Build layout
        if (! onlyAlpha && inputModes.length) {
            var option = '<option/>';
            $.each(inputModes, function (i, mode) {
                $select.append(
                    $(option).html(mode)
                );
            });
            $target.append(
                $select
            );
            selectHeight = $select.outerHeight(true);
        }

        var canvasHeight = panelHeight - selectHeight;
        var $canvas = $('<canvas/>')
            .attr('width', getPanelWidth())
            .attr('height', canvasHeight)
            .css('display', 'block');
        $target.append(
            $canvas
        );
        var $labels = $();
        var labelsHeight = 0;
        if (panelLabels) {
            $labels = $('<div />').addClass('ui-panel-labels').width(getPanelWidth());
            drawLabels();
            $target.append($labels);
        }

        // Initialise variables. step 2
        var canvas = $canvas[0];
        var ctx = canvas.getContext("2d");

        // Initialises panel
        self.setMode(inputMode);

        if (! onlyAlpha) {
            // Bind events
            $select.change(function () {
                self.setMode(
                    $(':selected', this).val()
                );
            });
        }
        $target.add($labels.find('div')).bind('mousedown touchstart', function (event) {
            if ($(this).is(event.target)) {
                event.preventDefault();
            }
        });
        $canvas.bind('mousedown touchstart', function (event) {
            event.preventDefault();
            draggingChannel = 0;
            var offset = 10;
            var inputPoint = Util.getEventPosition(false, event, $(this));
            while (draggingChannel < 5 && ! dragging) {
                if (inputPoint[0] > offset && inputPoint[0] < offset+channelWidth) {
                    dragging = 1;
                    draggingRenderer(event);
                } else {
                    draggingChannel++;
                    offset += channelWidth+channelMargin;
                }
            }
        }).bind('mousemove touchmove', function (event) {
            var inputPoint = Util.getEventPosition(false, event, $canvas);
            var width = $canvas.width();
            var padding = canvasPadding / 2;
            if (   inputPoint[0] > padding
                && inputPoint[1] > padding
                && inputPoint[0] < width - padding
                && inputPoint[1] < $canvas.height() - padding
            ) {
                var offset = padding;
                while (offset < width) {
                    if (inputPoint[0] > offset && inputPoint[0] < channelWidth + offset) {
                        $canvas.css('cursor', 'crosshair');
                        break;
                    } else {
                        $canvas.css('cursor', '');
                    }
                    offset += channelWidth + channelMargin;
                }
            } else {
                $canvas.css('cursor', '');
            }
        });
        $([window, document]).bind('mousemove touchmove', function (event) {
            if (dragging) {
                event.preventDefault();
                draggingRenderer(event);
            }
        }).bind('mouseup touchend', function (event) {
            if (dragging) {
                event.preventDefault();
                dragging = 0;
                draggingRenderer(event);
            }
        });
    };
})();

module.exports = Panel;
