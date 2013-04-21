
$(document).ready(function () {
    // for regular demos
    var $target = $('body');
    // for jQuery mobile demo
    if ($('div[data-role=page]').length > 0) {
        $target = $('div[data-role=page]');
    }
    // append notice to page
    $target.append(
        $('<div/>').css({
            'font-size':'0.7em',
            'padding':'2.5em 0.7em',
            'clear':'both'
        }).append(
            $('<p/>').append(
                'This demo uses the proprietary chromoselector jQuery plugin.'
            )
        ).append(
            $('<p/>').append(
                'Please visit <a href="http://chromoselector.com/" target="_blank">http://chromoselector.com/</a> to purchase a license.'
            )
        )
    );
});