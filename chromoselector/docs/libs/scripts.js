$(document).bind("pageinit", function(){
    $("h3.ui-collapsible-heading").bind("click", function () {
        $(this).parent().find("pre code").not(".done").addClass("done").each(function(i, e) {
            hljs.highlightBlock(e)
        });
    });
    $("pre.instant code").each(function(i, e) {
        hljs.highlightBlock(e)
    });
    $(".collapse").bind("click", function(){
        $(".ui-collapsible-heading:not(.ui-collapsible-heading-collapsed)").click();
    });
    $(".expand").bind("click", function(){
        $(".ui-collapsible-heading.ui-collapsible-heading-collapsed").click();
    });
});
if (navigator.userAgent.match(/MSIE 10/)) {
    $(document).bind("pageinit", function () {
        var classes = "abcde".split("");
        for (var i in classes) {
            $(".ui-btn-up-"+classes[i])
                .removeClass("ui-btn-up-"+classes[i])
                .addClass("backup-ui-btn-up-"+classes[i]);
        }
        setTimeout(function () {
            for (var i in classes) {
                $(".backup-ui-btn-up-"+classes[i])
                    .addClass("ui-btn-up-"+classes[i]);
            }
        }, 40)
    });
}