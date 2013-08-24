function TimeOutWithData(callback, delay, data, ctx) {
    this.data = data;
    this.callback = callback;
    this.delay = delay || 4;
    this.ctx = ctx || {};
    this.start();
}
TimeOutWithData.prototype.start = function () {
    var self = this;
    self.timeout = setTimeout(function () {
        self.callback.call(self.ctx, self.data);
    }, self.delay);
};
TimeOutWithData.prototype.clear = function () {
    clearTimeout(this.timeout);
};
$(document).on('pageinit', function () {
    var classes = [
        'ui-btn-up-a',
        'ui-btn-up-b',
        'ui-btn-up-c',
        'ui-btn-up-d',
        'ui-btn-up-e',
        'ui-bar-a',
        'ui-bar-b',
        'ui-bar-c',
        'ui-bar-d',
        'ui-bar-e'
    ];
    for (var i in classes) {
        var currentClass = classes[i];
        $('.' + currentClass).removeClass(currentClass)
            .addClass('ie-fix-' + currentClass);
        new TimeOutWithData(function (data) {
            $('.ie-fix-' + data).addClass(data);
        }, 4, currentClass);
    }
});