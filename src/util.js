'use strict';

module.exports = {
  getEventPosition: function(self, e, $obj) {
    var x = 0, y = 0;
    var oe = e.originalEvent;
    var touch = oe.touches || oe.changedTouches;
    var offset;
    var previewHeight;
    if (self) {
      offset = $obj.parent().offset();
      previewHeight = self._preview.outerHeight();
    } else {
      offset = $obj.offset();
      previewHeight = 0;
    }
    if (touch) {
      // touchscreen
      x = touch[0].pageX - offset.left;
      y = touch[0].pageY - offset.top - previewHeight;
    } else if (oe.clientX) {
      // mouse
      x = oe.clientX + window.pageXOffset - offset.left;
      y = oe.clientY + window.pageYOffset - offset.top - previewHeight;
    }
    return [x, y];
  }
};