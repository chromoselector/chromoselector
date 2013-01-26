
var Panel = (function () {
    // Shortens code below
    var addColorStop = 'addColorStop';
    // return constructor
    return function($target, panelHeight, channelWidth, channelMargin) {
        var self = this;
        // Declare functions
        var getPanelWidth = function(){
            var retval;
            if (mode === 'cmyk') {
                retval = channelWidth*4+channelMargin*3;
            } else {
                retval = channelWidth*3+channelMargin*2;
            }
            return retval;
        };
        var toggleColor = function(color, channel, value) {
            var retval = $.extend({}, color);
            retval[channel] = value;
            return new Color(retval);
        };
        var createGradient = function() {
            return ctx.createLinearGradient(
                0, panelHeight-channelWidth/2,
                0, channelWidth/2
            );
        };
        var setSimpleGradient = function(color1, color2) {
            var lingrad = createGradient();
            lingrad[addColorStop](0, color1.hex);
            lingrad[addColorStop](1, color2.hex);
            ctx.fillStyle = lingrad;
        };
        var setHueGradient = function() {
            var lingrad = createGradient();
            lingrad[addColorStop](0/6, '#f00');
            lingrad[addColorStop](1/6, '#ff0');
            lingrad[addColorStop](2/6, '#0f0');
            lingrad[addColorStop](3/6, '#0ff');
            lingrad[addColorStop](4/6, '#00f');
            lingrad[addColorStop](5/6, '#f0f');
            lingrad[addColorStop](6/6, '#f00');
            ctx.fillStyle = lingrad;
        };
        var setLightnessGradient = function(color){ 
            var lingrad = createGradient();
            lingrad[addColorStop](0,   '#000');
            lingrad[addColorStop](0.5, color.hex);
            lingrad[addColorStop](1,   '#fff');
            ctx.fillStyle = lingrad;
        };
        var setKeyGradient = function(color) {
            var lingrad = createGradient();
            lingrad[addColorStop](0, color.hex);
            lingrad[addColorStop](1, '#000');
            ctx.fillStyle = lingrad;
        };
        var roundEdges = function(channel, color1, color2) {
            if (typeof color1 === 'object') {
                color1 = color1.hex;
            }
            if (typeof color2 === 'object') {
                color2 = color2.hex;
            }
            ctx.fillStyle = color1;
            ctx.beginPath();
            ctx.arc(
                channelWidth/2 + channel * (channelWidth+channelMargin),
                panelHeight-channelWidth/2,
                channelWidth/2,
                0,
                Math.PI*2,
                true
            );
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = color2;
            ctx.beginPath();
            ctx.arc(
                channelWidth/2 + channel * (channelWidth+channelMargin),
                channelWidth/2,
                channelWidth/2,
                0,
                Math.PI*2,
                true
            );
            ctx.closePath();
            ctx.fill();
        };
        var drawPanel = function() {
            ctx.clearRect(0,0,(channelWidth+channelMargin)*4,panelHeight);

            var i, color1, color2, offset, channel;
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
                        panelHeight-channelWidth
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
                    panelHeight-channelWidth
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
                    panelHeight-channelWidth
                );

                roundEdges(
                    2,
                    '#000',
                    '#fff'
                );
                var lighnessHsl = $.extend({}, currentColor.hsl);
                lighnessHsl.l = 0.5;
                setLightnessGradient(new Color(lighnessHsl));
                ctx.fillRect(
                    (channelWidth+channelMargin)*2,
                    channelWidth/2,
                    channelWidth,
                    panelHeight-channelWidth
                );

                drawIndicators(currentColor.hsl);
            } else if (mode === 'cmyk') {
                offset = 0;
                channel = 0;
                var cmy = 'cmy'.split('');
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
                        panelHeight-channelWidth
                    );
                    offset += channelWidth + channelMargin;
                    channel++;
                }
                roundEdges(
                    channel,
                    currentColor,
                    '#000'
                );
                setKeyGradient(currentColor);
                ctx.fillRect(
                    (channelWidth+channelMargin)*3,
                    channelWidth/2,
                    channelWidth,
                    panelHeight-channelWidth
                );
                drawIndicators(currentColor.cmyk);
            }
        };
        var drawIndicators = function(color) {
            var offset = 0;
            for (var channel in color) {
                var x = offset + channelWidth/2;
                var verticalSpace = panelHeight - channelWidth;
                var y = verticalSpace - (verticalSpace * color[channel]) + channelWidth/2;

                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.stroke();

                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 4.5, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.stroke();

                offset += channelWidth + channelMargin;
            }
        };
        var dragHandler = function(event) {
            var inputPoint = getEventPosition(false, event, $canvas);
            var fullScaleValue = panelHeight - channelWidth;
            var position = fullScaleValue - Math.round(inputPoint[1] - channelWidth/2);
            if (position < 0) {
                position = 0;
            } else if (position > fullScaleValue) {
                position = fullScaleValue;
            }
            var value = position / fullScaleValue;
            if (mode === 'rgb') {
                if (draggingChannel === 3) {
                    return;
                }
                currentColor.rgb[indexes[draggingChannel]] = value;
                currentColor = new Color(
                    currentColor.rgb
                );
            } else if (mode === 'hsl') {
                if (draggingChannel === 3) {
                    return;
                }
                currentColor.hsl[indexes[draggingChannel]] = value;
                currentColor = new Color(
                    currentColor.hsl
                );
            } else if (mode === 'cmyk') {
                currentColor.cmyk[indexes[draggingChannel]] = value;
                currentColor = new Color(
                    currentColor.cmyk
                );
            }
            drawPanel();
        };
        var draggingRenderer = throttle(dragHandler);

        // API
        self.setPanelHeight = function (newHeight) {
            panelHeight = newHeight;
            $canvas.attr('height', newHeight);
            canvas.height = newHeight;
            drawPanel();
        };
        self.setChannelWidth = function (newWidth) {
            channelWidth = newWidth;
            $canvas.attr('width', getPanelWidth());
            canvas.width = getPanelWidth();
            drawPanel();
        };
        self.setChannelMargin = function (newMargin) {
            channelMargin = newMargin;
            $canvas.attr('width', getPanelWidth());
            canvas.width = getPanelWidth();
            drawPanel();
        };
        self.setColor = function (newColor) { // Throttle?
            currentColor = newColor;
            drawPanel();
        };
        self.setMode = function (newMode) {
            $select.find('option').each(function () {
                if ($(this).val() === newMode) {
                    $(this).select();
                    mode = newMode;
                    indexes = mode.split('');
                    self.setChannelWidth(channelWidth);
                    // drawPanel();
                }
            });
        };
        // Initialise variables. step 1
        var currentColor = new Color();
        var mode = 'rgb';
        var indexes = mode.split('');
        var dragging = 0;
        var draggingChannel = 0;
        // Create layout elements
        var $select = $('<select/>').css(
            'display', 'block'
        ).append(
            $('<option/>').html('rgb')
        ).append(
            $('<option/>').html('hsl')
        ).append(
            $('<option/>').html('cmyk')
        );
        var $canvas = $('<canvas/>')
            .attr('width', getPanelWidth())
            .attr('height', panelHeight);
        // Build layout
        $target.append(
            $select
        ).append(
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
                $(this).find(':selected').val()
            );
        });
        $canvas.bind('mousedown touchstart', function (event) {
            event.preventDefault();
            var inputPoint = getEventPosition(false, event, $(this));
            if (inputPoint[1] > 0 && inputPoint[1] < panelHeight) {
                var channel = 0;
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
