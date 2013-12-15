var Preview = (function(previewColor, width, shadowColor, shadowRadius) {
    var getShadowCss = function (shadowColor, shadowRadius) {
        shadowColor = new Color(shadowColor)
            .setAlpha(shadowCssColor.getAlpha() - 0.1)
            .getRgbaString();
        shadowRadius = Math.max(0, shadowRadius - 2);
        return '0 0 ' + shadowRadius + 'px 0 ' + shadowColor;
    };

    var self = this;
    var shadowCss = getShadowCss(shadowColor, shadowRadius);
    var $root = $('<div/>')
        .addClass('ui-cs-preview-container');
    var $previewWidget = $('<div/>')
        .addClass('ui-cs-preview-widget')
        .css('overflow', 'hidden')
        .css('box-shadow', shadowCss)
        .css('-webkit-box-shadow', shadowCss);
    var $previewCanvas = $('<canvas/>').css({ display:'block' });
    var $previewColor = $('<div/>')
        .addClass('ui-cs-preview-color')
        .css('width','100%')
        .css('position', 'relative');

    $root.append(
        $previewWidget
            .append($previewCanvas)
            .append($previewColor);
    );

    var setColor = function (color) {
        $previewColor.css('background-color', color.getRgbaString());
    };
    var update = function (newWidth) {
        var previewHeight = $previewWidget.height();
        $previewCanvas.height(previewHeight);
        $previewColor
            .css('top', '-' + previewHeight + 'px')
            .height(previewHeight);
        var ctx = $previewCanvas[0].getContext('2d');
        $previewCanvas[0].height = previewHeight;
        $previewCanvas[0].width = 500;
        $previewCanvas.css('width', '500px');
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
        ctx[fillStyle] = pattern;
        ctx[fillRect](
            0,
            0,
            newWidth,
            previewHeight
        );
    };

    update(width);
    setColor(previewColor);

    return {
        // public functions
        setColor: function (color) {
            setColor(color);
        },
        update: function () {
            update();
        },
        getHeight: function () {
            return $root.outerHeight();
        },
        getWidth: function () {
            return width;
        },
        setWidth: function (newWidth) {
            update(newWidth);
        },
        getElement: function () {
            return $root;
        }
    };
})();