'use strict';

var Throttle = (function() {
    return function(functionToCall, timeoutInMs) {
        timeoutInMs = timeoutInMs || 4;
        var timer, savedArguments, needInvokation, tick = function () {
            if (needInvokation) {
                functionToCall.apply({}, savedArguments);
                needInvokation = 0;
                timer = setTimeout(tick, timeoutInMs);
            } else {
                timer = 0;
            }
        };
        return function() {
            savedArguments = arguments;
            needInvokation = 1;
            if (! timer) {
                tick();
            }
        };
    };
})();

module.exports = Throttle;