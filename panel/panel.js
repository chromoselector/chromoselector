
var Panel = (function () {
    // Shortens code below
    var addColorStop = 'addColorStop';
    var fillRect = 'fillRect';
    var fillStyle = 'fillStyle';
    // return constructor
    return function($target, alphaSupport, panelHeight, channelWidth, channelMargin) {
        var self = this;
        // Declare functions
        var getPanelWidth = function(){
            var offset = 0;
            if (alphaSupport) {
                offset = channelWidth+channelMargin;
            }
            if (mode === 'cmyk') {
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
                0, canvasHeight-channelWidth/2,
                0, channelWidth/2
            );
        };
        var setSimpleGradient = function(color1, color2) {
            lingrad = createGradient();
            lingrad[addColorStop](0, color1.getHexString());
            lingrad[addColorStop](1, color2.getHexString());
            ctx[fillStyle] = lingrad;
        };
        var setHueGradient = function() {
            lingrad = createGradient();
            lingrad[addColorStop](0/6, '#f00');
            lingrad[addColorStop](1/6, '#ff0');
            lingrad[addColorStop](2/6, '#0f0');
            lingrad[addColorStop](3/6, '#0ff');
            lingrad[addColorStop](4/6, '#00f');
            lingrad[addColorStop](5/6, '#f0f');
            lingrad[addColorStop](6/6, '#f00');
            ctx[fillStyle] = lingrad;
        };
        var setLightnessGradient = function(color) {
            lingrad = createGradient();
            lingrad[addColorStop](0,   '#000');
            lingrad[addColorStop](0.5, color.getHexString());
            lingrad[addColorStop](1,   '#fff');
            ctx[fillStyle] = lingrad;
        };
        var setKeyGradient = function(color) {
            lingrad = createGradient();
            lingrad[addColorStop](0, color.getHexString());
            lingrad[addColorStop](1, '#000');
            ctx[fillStyle] = lingrad;
        };
        var drawCircle = function (color, x, y, noFill) {
            if (typeof color === 'object') {
                color = color.getHexString();
            }
            if (! noFill) {
                ctx[fillStyle] = color;
            }
            ctx.beginPath();
            ctx.arc(x, y, channelWidth/2, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
        var roundEdges = function(channel, color1, color2, noFill) {
            var x = channelWidth/2 + channel * (channelWidth+channelMargin);
            drawCircle(
                color1,
                x,
                canvasHeight-channelWidth/2,
                noFill
            );
            drawCircle(
                color2,
                x,
                channelWidth/2,
                noFill
            );
        };
        var drawPanel = function() {
            ctx.clearRect(0,0,getPanelWidth(),canvasHeight);
            var i, x, color1, color2, lighnessHsl, keyCmyk, cmy;
            var offset = 0;
            var channel = 0;

            if (alphaSupport) {
                // Draw checkboard background
                var tempCanvas = document.createElement('canvas');
                tempCanvas.height = 10;
                tempCanvas.width = 10;
                var tempCtx = tempCanvas.getContext('2d');
                tempCtx[fillStyle] = '#ccc';
                tempCtx[fillRect](0, 0, 10, 10);
                tempCtx[fillStyle] = '#888';
                tempCtx[fillRect](0, 0, 5, 5);
                tempCtx[fillRect](5, 5, 5, 5);
                var pattern = ctx.createPattern(tempCanvas, 'repeat');
                ctx.fillStyle = pattern;
                ctx[fillRect](
                    0,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );
                roundEdges(0, 0, 0, 1); // draw edges without setting a fill

                // Alpha overlay
                x = channelWidth/2;
                ctx[fillStyle] = currentColor.getHexString();
                ctx.beginPath();
                ctx.arc(
                    x,
                    channelWidth/2,
                    channelWidth/2,
                    0,
                    Math.PI,
                    true
                );
                ctx.closePath();
                ctx.fill();

                lingrad = createGradient();
                lingrad[addColorStop](0, new Color(currentColor).setAlpha(0).getRgbaString());
                lingrad[addColorStop](1, currentColor.getHexString());
                ctx[fillStyle] = lingrad;
                ctx[fillRect](
                    0,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );
                offset = channelWidth + channelMargin;
                channel = 1;
            }
            if (mode === 'rgb') {
                for (i in indexes) {
                    color1 = toggleColor(currentColor.getRgb(), indexes[i], 0);
                    color2 = toggleColor(currentColor.getRgb(), indexes[i], 1);
                    roundEdges(
                        channel,
                        color1,
                        color2
                    );
                    setSimpleGradient(
                        color1,
                        color2
                    );
                    ctx[fillRect](
                        offset,
                        channelWidth/2,
                        channelWidth,
                        canvasHeight-channelWidth
                    );
                    offset += channelWidth + channelMargin;
                    channel++;
                }
                drawIndicators(currentColor.getRgb());
            } else if (mode === 'hsl') {
                roundEdges(
                    channel,
                    'red',
                    'red'
                );
                setHueGradient();
                ctx[fillRect](
                    offset,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );

                channel++;
                offset += channelWidth + channelMargin;
                color1 = toggleColor(currentColor.getHsl(), 's', 0);
                color2 = toggleColor(currentColor.getHsl(), 's', 1);
                roundEdges(
                    channel,
                    color1,
                    color2
                );
                setSimpleGradient(
                    color1,
                    color2
                );
                ctx[fillRect](
                    offset,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );

                channel++;
                offset += channelWidth + channelMargin;
                roundEdges(
                    channel,
                    '#000',
                    '#fff'
                );
                lighnessHsl = $.extend({}, currentColor.getHsl());
                lighnessHsl.l = 0.5;
                setLightnessGradient(new Color(lighnessHsl));
                ctx[fillRect](
                    offset,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );

                drawIndicators(currentColor.getHsl());
            } else if (mode === 'cmyk') {
                cmy = 'cmy'.split('');
                for (i in cmy) {
                    color1 = toggleColor(currentColor.getCmyk(), cmy[i], 0);
                    color2 = toggleColor(currentColor.getCmyk(), cmy[i], 1);
                    roundEdges(
                        channel,
                        color1,
                        color2
                    );
                    setSimpleGradient(
                        color1,
                        color2
                    );
                    ctx[fillRect](
                        offset,
                        channelWidth/2,
                        channelWidth,
                        canvasHeight-channelWidth
                    );
                    offset += channelWidth + channelMargin;
                    channel++;
                }
                keyCmyk = $.extend({}, currentColor.getCmyk());
                keyCmyk.k = 0;
                keyCmyk = new Color(keyCmyk);
                roundEdges(
                    channel,
                    keyCmyk,
                    '#000'
                );
                setKeyGradient(keyCmyk);
                ctx[fillRect](
                    offset,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );
                drawIndicators(currentColor.getCmyk());
            }
        };
        var drawIndicators = function(color) {
            var offset = 0, channel;
            var indicator = function (color, lineWidth, diameter){
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.arc(x, y, diameter, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.stroke();
            };
            if (alphaSupport) {
                var x = offset + channelWidth/2;
                var verticalSpace = canvasHeight - channelWidth;
                var y = verticalSpace - (verticalSpace * currentColor.getRgba().a) + channelWidth/2;
                offset += channelWidth + channelMargin;
                indicator("#fff", 1.5, 6);
                indicator("#000", 2, 4.5);
            }
            for (channel in color) {
                var x = offset + channelWidth/2;
                var verticalSpace = canvasHeight - channelWidth;
                var y = verticalSpace - (verticalSpace * color[channel]) + channelWidth/2;
                indicator("#fff", 1.5, 6);
                indicator("#000", 2, 4.5);
                offset += channelWidth + channelMargin;
            }
        };
        var draggingRenderer = throttle(function(event) {
            var inputPoint = getEventPosition(false, event, $canvas);
            var fullScaleValue = canvasHeight - channelWidth;
            var position = fullScaleValue - Math.round(inputPoint[1] - channelWidth/2);
            if (position < 0) {
                position = 0;
            } else if (position > fullScaleValue) {
                position = fullScaleValue;
            }
            var value = position / fullScaleValue;
            if (alphaSupport && draggingChannel == 0) {
                currentColor.setAlpha(value);
            } else {
                var index = draggingChannel;
                if (alphaSupport) {
                    index--;
                }
                var functionToCall = 'get' + mode.charAt(0).toUpperCase() + mode.slice(1)
                var tempColor = currentColor[functionToCall]();
                tempColor[indexes[index]] = value;
                currentColor = new Color(
                    tempColor
                ).setAlpha(currentColor.getRgba().a);
            }

            drawPanel();
            $target.trigger('update');
        });

        // API
        self.setHeight = function (newHeight) {
            ctx.clearRect(0,0,getPanelWidth(),canvasHeight);
            canvasHeight = newHeight - $select.outerHeight(true) - targetPadding;
            $canvas.attr('height', canvasHeight);
            //canvas.height = canvasHeight;
            drawPanel();
        };
        self.setColor = function (newColor) { // Throttle?
            currentColor = new Color(newColor);
            drawPanel();
        };
        self.getColor = function () {
            return currentColor;
        };
        self.setMode = function (newMode) {
            mode = $select.val(newMode).val();
            indexes = mode.split('');
            // Update panel width in case the number
            // of channels has changed
            //self.setChannelWidth(channelWidth);
            $canvas.attr('width', getPanelWidth());
            drawPanel();
        };

        // Initialise variables. step 1
        var lingrad;
        var currentColor = new Color();
        var mode = 'rgb';
        var indexes = mode.split('');
        var dragging = 0;
        var draggingChannel = 0;
        var targetPadding = $target.outerHeight(true);

        // Build layout
        var option = '<option/>';
        var $select = $('<select/>')/*.css(
            'display', 'block'
        )*/.append(
            $(option).html('rgb')
        ).append(
            $(option).html('hsl')
        ).append(
            $(option).html('cmyk')
        );
        $target.append(
            $select
        );
        var canvasHeight = panelHeight - $select.outerHeight(true) - targetPadding;
        var $canvas = $('<canvas/>')
            .attr('width', getPanelWidth())
            .attr('height', canvasHeight)
            .css('display', 'block');
        $target.append(
            $canvas
        );

        // Initialise variables. step 2
        var canvas = $canvas[0];
        var ctx = canvas.getContext("2d");

        // Initialise panel
        drawPanel();

        // Bind events
        $select.change(function () {
            self.setMode(
                $(':selected', this).val()
            );
        });
        $canvas.bind('mousedown touchstart', function (event) {
            preventDefault(event);
            draggingChannel = 0;
            var offset = 0;
            var inputPoint = getEventPosition(false, event, $(this));
            while (draggingChannel < 5 && ! dragging) {
                if (inputPoint[0] > offset && inputPoint[0] < offset+channelWidth) {
                    dragging = 1;
                    draggingRenderer(event);
                } else {
                    draggingChannel++;
                    offset += channelWidth+channelMargin;
                }
            }
        });
        $([window, document]).bind('mousemove touchmove', function (event) {
            if (dragging) {
                preventDefault(event);
                draggingRenderer(event);
            }
        }).bind('mouseup touchend', function (event) {
            if (dragging) {
                preventDefault(event);
                dragging = 0;
                draggingRenderer(event);
            }
        });
    };
})();
