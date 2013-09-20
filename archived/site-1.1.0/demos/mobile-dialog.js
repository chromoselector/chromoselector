$(document).bind('pageinit', function () {
    var $current, $input = $('<input />');
    $input.chromoselector({
        autoshow: false,
        width: 250,
        target: $('#picker'),
        autosave: false,
        resize: function () {
            $("#dialog").children('div').width(
                api.getWidth()
            ).children('div').width(
                api.getWidth()
            );
        }
    });
    var api = $input.chromoselector('api');
    $('.open').click(function () {
        $current = $(this).prev();
        $input.val($current.val());
        api.load().show();
        $.mobile.changePage("#dialog");
        $("#dialog").show();
        $input.trigger('resize');
    });
    $('#save').click(function () {
        api.save();
        $current.val($input.val());
        $('#dialog').dialog('close').hide();
    });
    $('#close').click(function () {
        $('#dialog').dialog('close').hide();
    });
});
