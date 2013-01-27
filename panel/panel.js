
var Panel = (function () {
    // Shortens code below
    var addColorStop = 'addColorStop';
    // return constructor
    return function($target, panelHeight, channelWidth, channelMargin) {
        var self = this;
        // Declare functions
        var getPanelWidth = function(){
            if (mode === 'cmyk') {
                return channelWidth*4+channelMargin*3;
            } else {
                return channelWidth*3+channelMargin*2;
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
            lingrad[addColorStop](0, color1.hex);
            lingrad[addColorStop](1, color2.hex);
            ctx.fillStyle = lingrad;
        };
        var setHueGradient = function() {
            lingrad = createGradient();
            /* Shorter code, executes way slower though
            for (var i=0;i<7;) {
                lingrad[addColorStop](
                    i/6, new Color({ h: ++i/6, s: 1, l: 0.5 }).hex
                );
            }*/
            lingrad[addColorStop](0/6, '#f00');
            lingrad[addColorStop](1/6, '#ff0');
            lingrad[addColorStop](2/6, '#0f0');
            lingrad[addColorStop](3/6, '#0ff');
            lingrad[addColorStop](4/6, '#00f');
            lingrad[addColorStop](5/6, '#f0f');
            lingrad[addColorStop](6/6, '#f00');
            ctx.fillStyle = lingrad;
        };
        var setLightnessGradient = function(color) {
            lingrad = createGradient();
            lingrad[addColorStop](0,   '#000');
            lingrad[addColorStop](0.5, color.hex);
            lingrad[addColorStop](1,   '#fff');
            ctx.fillStyle = lingrad;
        };
        var setKeyGradient = function(color) {
            lingrad = createGradient();
            lingrad[addColorStop](0, color.hex);
            lingrad[addColorStop](1, '#000');
            ctx.fillStyle = lingrad;
        };
        var drawCircle = function (color, x, y) {
            if (typeof color === 'object') {
                color = color.hex;
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, channelWidth/2, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
        var roundEdges = function(channel, color1, color2) {
            var x = channelWidth/2 + channel * (channelWidth+channelMargin);
            drawCircle(
                color1,
                x,
                canvasHeight-channelWidth/2
            );
            drawCircle(
                color2,
                x,
                channelWidth/2
            );
        };
        var drawPanel = function() {
            ctx.clearRect(0,0,getPanelWidth(),canvasHeight);

            var i, color1, color2, offset, channel, lighnessHsl, keyCmyk, cmy;
            if (mode === 'rgb') {
                offset = 0;
                channel = 0;
                for (i in indexes) {
                    color1 = toggleColor(currentColor.rgb, indexes[i], 0);
                    color2 = toggleColor(currentColor.rgb, indexes[i], 1);
                    roundEdges(
                        channel,
                        color1,
                        color2
                    );
                    setSimpleGradient(
                        color1,
                        color2
                    );
                    ctx.fillRect(
                        offset,
                        channelWidth/2,
                        channelWidth,
                        canvasHeight-channelWidth
                    );
                    offset += channelWidth + channelMargin;
                    channel++;
                }
                drawIndicators(currentColor.rgb);
            } else if (mode === 'hsl') {
                roundEdges(
                    0,
                    'red',
                    'red'
                );
                setHueGradient();
                ctx.fillRect(
                    0,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );

                color1 = toggleColor(currentColor.hsl, 's', 0);
                color2 = toggleColor(currentColor.hsl, 's', 1);
                roundEdges(
                    1,
                    color1,
                    color2
                );
                setSimpleGradient(
                    color1,
                    color2
                );
                ctx.fillRect(
                    channelWidth + channelMargin,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );

                roundEdges(
                    2,
                    '#000',
                    '#fff'
                );
                lighnessHsl = $.extend({}, currentColor.hsl);
                lighnessHsl.l = 0.5;
                setLightnessGradient(new Color(lighnessHsl));
                ctx.fillRect(
                    (channelWidth+channelMargin)*2,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );

                drawIndicators(currentColor.hsl);
            } else if (mode === 'cmyk') {
                offset = 0;
                channel = 0;
                cmy = 'cmy'.split('');
                for (i in cmy) {
                    color1 = toggleColor(currentColor.cmyk, cmy[i], 0);
                    color2 = toggleColor(currentColor.cmyk, cmy[i], 1);
                    roundEdges(
                        channel,
                        color1,
                        color2
                    );
                    setSimpleGradient(
                        color1,
                        color2
                    );
                    ctx.fillRect(
                        offset,
                        channelWidth/2,
                        channelWidth,
                        canvasHeight-channelWidth
                    );
                    offset += channelWidth + channelMargin;
                    channel++;
                }
                keyCmyk = $.extend({}, currentColor.cmyk);
                keyCmyk.k = 0;
                keyCmyk = new Color(keyCmyk);
                roundEdges(
                    channel,
                    keyCmyk,
                    '#000'
                );
                setKeyGradient(keyCmyk);
                ctx.fillRect(
                    (channelWidth+channelMargin)*3,
                    channelWidth/2,
                    channelWidth,
                    canvasHeight-channelWidth
                );
                drawIndicators(currentColor.cmyk);
            }
        };
        var drawIndicators = function(color) {
            var offset = 0, channel;
            for (channel in color) {
                var x = offset + channelWidth/2;
                var verticalSpace = canvasHeight - channelWidth;
                var y = verticalSpace - (verticalSpace * color[channel]) + channelWidth/2;
                var indicator = function (color, lineWidth, diameter){
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.arc(x, y, diameter, 0, Math.PI*2, true);
                    ctx.closePath();
                    ctx.stroke();
                };
                indicator("#fff", 1.5, 6);
                indicator("#000", 2, 4.5);
                offset += channelWidth + channelMargin;
            }
        };
        var dragHandler = function(event) {
            var inputPoint = getEventPosition(false, event, $canvas);
            var fullScaleValue = canvasHeight - channelWidth;
            var position = fullScaleValue - Math.round(inputPoint[1] - channelWidth/2);
            if (position < 0) {
                position = 0;
            } else if (position > fullScaleValue) {
                position = fullScaleValue;
            }
            var value = position / fullScaleValue;
            currentColor[mode][indexes[draggingChannel]] = value;
            currentColor = new Color(
                currentColor[mode]
            );
            drawPanel();
        };
        var draggingRenderer = throttle(dragHandler);

        // API
        self.setHeight = function (newHeight) {
            ctx.clearRect(0,0,getPanelWidth(),canvasHeight);
            canvasHeight = newHeight - $select.outerHeight(true) - targetPadding;
            $canvas.attr('height', canvasHeight);
            //canvas.height = canvasHeight;
            drawPanel();
        };
        self.setChannelWidth = function (newWidth) {
            channelWidth = newWidth;
            $canvas.attr('width', getPanelWidth());
            //canvas.width = getPanelWidth();
            drawPanel();
        };
        self.setChannelMargin = function (newMargin) {
            channelMargin = newMargin;
            $canvas.attr('width', getPanelWidth());
            //canvas.width = getPanelWidth();
            drawPanel();
        };
        self.setColor = function (newColor) { // Throttle?
            currentColor = new Color(newColor);
            drawPanel();
        };
        self.setMode = function (newMode) {
            mode = $select.val(newMode).val();
            indexes = mode.split('');
            // Update panel width in case the number
            // of channels has changed
            self.setChannelWidth(channelWidth);
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
        var $select = $('<select/>').css(
            'display', 'block'
        ).append(
            $('<option/>').html('rgb')
        ).append(
            $('<option/>').html('hsl')
        ).append(
            $('<option/>').html('cmyk')
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
            var channel = 0;
            var inputPoint = getEventPosition(false, event, $(this));
            if (inputPoint[1] > 0 && inputPoint[1] < canvasHeight) {
                while (channel <= 3) {
                    var offset = (channelWidth+channelMargin)*channel;
                    if (inputPoint[0] > offset && inputPoint[0] < offset+channelWidth) {
                        dragging = 1;
                        draggingChannel = channel;
                        draggingRenderer(event);
                        break;
                    }
                    channel++;
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
