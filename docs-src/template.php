<?php

function tidy_up($html){
    // Specify configuration
    $config = array(
        'hide-comments'       => true,
        'indent'              => true,
        'indent-spaces'       => 2,
        'new-blocklevel-tags' => 'article,header,footer,section,nav',
        'new-inline-tags'     => 'video,audio,canvas,ruby,rt,rp',
        'output-xhtml'        => true,
        'wrap'                => 200
    );

    // Tidy
    $tidy = new tidy;
    $tidy->parseString($html, $config, 'utf8');

    //echo $tidy->errorBuffer . "\n";

    $tidy->cleanRepair();

    // Drop doctype
    $output = str_replace(
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' . "\n",
        '',
        $tidy
    );

    // Output
    return str_replace(
        '<html xmlns="http://www.w3.org/1999/xhtml">',
        "<!DOCTYPE html>\n<html>",
        $output
    );
}

function getHeader($path = '.', $type = 'interior', $title = '') {
    if (empty($_GET['SITE'])) {
        if ($path === '.') {
            $libPath = '..';
        } else {
            $libPath = $path . '/..';
        }
    } else {
        $libPath = $path . '/libs';
    }

    $html  = '<!DOCTYPE html><html><head><title>ChromoSelector - jQuery Color Picker plugin : ' . $title . '</title>';
    $html .= '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';

    if (! empty($_GET['SITE'])) {
        $html .= '<script type="text/javascript">';
        $html .= 'if (top.location != location) {';
        $html .= 'top.location.href = document.location.href;';
        $html .= '}';
        $html .= '</script>';
    }

    $html .= '<link rel="stylesheet" type="text/css" href="' . $path . '/libs/jquery.mobile-1.3.1.min.css" />';
    $html .= '<link rel="stylesheet" type="text/css" href="' . $libPath . '/chromoselector.css" />';
    $html .= '<link rel="stylesheet" type="text/css" href="' . $path . '/libs/style.css" />';
    $html .= '<link rel="stylesheet" type="text/css" href="' . $path . '/libs/default.min.css">';
    $html .= '<link href="' . $path . '/libs/images/favicon.png" rel="shortcut icon" />';
    $html .= '</head>';

    if ($type != 'home') {
        $html .= '<body>';
        $html .= '<div data-role="page" class="type-interior" id="' . $type . '">';
        $html .= '<div data-role="header" data-theme="a">';
        $html .= '<h1>' . $title . '</h1>';
        $html .= '<a href="../index.html" data-icon="home" data-iconpos="notext" data-direction="reverse">Home</a>';
        if (empty($_GET['RELEASE'])) {
            $html .= '<a data-theme="b" href="../overview/purchase.html">Buy now</a>';
        }
        $html .= '</div>';
        $html .= '<div data-role="content">';
    } else {
        $html .= '<body>';
        $html .= '<div data-role="page" class="type-home">';
        $html .= '<div data-role="content">';
    }

    return $html;
}

function getFooter($path = '.') {
    if (empty($_GET['SITE'])) {
        if ($path === '.') {
            $libPath = '..';
        } else {
            $libPath = $path . '/..';
        }
    } else {
        $libPath = $path . '/libs';
    }
    $html  = '</div>';
    $html .= '<div data-role="footer" class="footer-docs" data-theme="c">';
    $html .= '<p>v2.0.0</p>';
    $html .= '<p style="float: right">&copy; 2013 <a href="http://www.chromoselector.com/">www.chromoselector.com</a></p>';
    $html .= '<div style="clear:both"></div>';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '<script src="' . $libPath . '/jquery-1.9.1.min.js" type="text/javascript"></script>';

    $html .= '<script type="text/javascript">';
    $html .= '$(document).on("mobileinit", function(){';
    $html .= '$.mobile.ajaxEnabled = false;';
    $html .= '});';
    $html .= '
$(window).load(function () {
    var url = location.href;
    var target = "";
    var index = url.lastIndexOf("?target=");
    if (index !== -1) {
        target = url.substr(index + 8);
    }
    if (target) {
        var $target = $("#" + target);
        if ($target.length) {
            $target.find("h3").click();
            $("html, body").animate({
                scrollTop: $("#" + target).find("h3").offset().top - $(".ui-header").outerHeight()
            }, 400);
        }
    }
});
    ';
    $html .= '</script>';

    $html .= '<script src="' . $path . '/libs/jquery.mobile-1.3.1.min.js" type="text/javascript"></script>';
    if (empty($_GET['SITE'])) {
        $html .= '<script src="' . $libPath . '/chromoselector.min.js" type="text/javascript"></script>';
    } else {
        $html .= '<script src="' . $libPath . '/chromoselector.demo.min.js" type="text/javascript"></script>';
    }
    $html .= '<script src="' . $path . '/demos/demos.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/libs/highlight.pack.js" type="text/javascript"></script>';


    $html .= '<script type="text/javascript">';
    $html .= '$(document).bind("pageinit", function(){';

    $html .= '$("h3.ui-collapsible-heading").bind("click", function () {';
    $html .= '$(this).parent().find("pre code").not(".done").addClass("done").each(function(i, e) {hljs.highlightBlock(e)});';
    $html .= '});';

    $html .= '$("pre.instant code").each(function(i, e) {hljs.highlightBlock(e)});';

    $html .= '$(".collapse").bind("click", function(){';
    $html .= '$(".ui-collapsible-heading:not(.ui-collapsible-heading-collapsed)").click();';
    $html .= '});';
    $html .= '$(".expand").bind("click", function(){';
    $html .= '$(".ui-collapsible-heading.ui-collapsible-heading-collapsed").click();';
    $html .= '});';

    $html .= '});';
    $html .= '</script>';
    $html .= '</body></html>';
    return $html;
}

?>
