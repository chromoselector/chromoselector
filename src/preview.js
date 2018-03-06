'use strict';

var Preview = (function() {
    var makePattern = function (ctx) {
        var tempCanvas = document.createElement('canvas');
        tempCanvas.height = 10;
        tempCanvas.width = 10;
        var tempCtx = tempCanvas.getContext('2d');
        tempCtx['fillStyle'] = '#ccc';
        tempCtx['fillRect'](0, 0, 10, 10);
        tempCtx['fillStyle'] = '#888';
        tempCtx['fillRect'](0, 0, 5, 5);
        tempCtx['fillRect'](5, 5, 5, 5);
        return ctx.createPattern(tempCanvas, 'repeat');
    };
    var setColor = function (ctx, color, previewWidth, previewHeight) {
        ctx['fillStyle'] = color.getRgbaString();
        ctx['fillRect'](0, 0, previewWidth, previewHeight);
    };
    var drawPattern = function (ctx, pattern, previewWidth, previewHeight) {
        ctx['fillStyle'] = pattern;
        ctx['fillRect'](0, 0, previewWidth, previewHeight);
    };
    var setWidth = function ($target, $previewWidget, newWidth, previewWidth, previewHeight) {
        previewWidth = newWidth - ($target.innerWidth() - $target.width());
        $previewWidget.height(previewHeight);
        $previewWidget[0].height = previewHeight;
        $previewWidget[0].width = previewWidth;
        $previewWidget.add($target).width(previewWidth).height(previewHeight);
        return previewWidth;
    };
    var getShadowCss = function (shadowColor, shadowRadius) {
        shadowColor = new Color(shadowColor)
            .setAlpha(shadowColor.getAlpha() - 0.1)
            .getRgbaString();
        shadowRadius = Math.max(0, shadowRadius - 2);
        return '0 0 ' + shadowRadius + 'px 0 ' + shadowColor;
    };
    return function($target, color, width, shadowColor, shadowRadius) {
        var $previewWidget, previewColor, previewWidth, previewHeight, pattern, ctx;
        var self = this;
        var shadowCss = getShadowCss(shadowColor, shadowRadius);
        $target.addClass('ui-cs-preview-container');
        $previewWidget = $('<canvas/>')
            .addClass('ui-cs-preview-widget')
            .css({
                'box-shadow': shadowCss,
                '-webkit-box-shadow': shadowCss
            });
        $target.append(
            $previewWidget
        );
        ctx = $previewWidget[0].getContext('2d');
        pattern = makePattern(ctx);
        previewHeight = $target.height();
        previewWidth = setWidth($target, $previewWidget, width, previewWidth, previewHeight);
        drawPattern(ctx, pattern, previewWidth, previewHeight);
        previewColor = color;
        setColor(ctx, color, previewWidth, previewHeight);
        // public functions
        self.setColor = function (color) {
            if (color.getAlpha() < 1) {
                drawPattern(ctx, pattern, previewWidth, previewHeight);
            }
            previewColor = color;
            setColor(ctx, color, previewWidth, previewHeight);
        };
        self.setWidth = function (newWidth) {
            previewHeight = $target.height();
            previewWidth = setWidth($target, $previewWidget, newWidth, previewWidth, previewHeight);
            drawPattern(ctx, pattern, previewWidth, previewHeight);
            setColor(ctx, previewColor, previewWidth, previewHeight);
        };
        self.getHeight = function () {
            return $target.outerHeight(true);
        };
        self.getWidth = function () {
            return $target.outerWidth(true);
        };
    };
})();

module.exports = Preview;
