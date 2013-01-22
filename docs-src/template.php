<?php

function tidy_up($html){
    // Specify configuration
    $config = array(
       'indent'       => true,
       'output-xhtml' => true,
       'wrap'         => 200
    );

    // Tidy
    $tidy = new tidy;
    $tidy->parseString($html, $config, 'utf8');
    $tidy->cleanRepair();

    // Output
    return $tidy . "";
}

function getHeader($path = '.', $type = 'interior', $title = '') {
    if (empty($_GET['SITE'])) {
        $libPath = $path . '/..';
    } else {
        $libPath = $path . '/libs';
    }

    $html  = '<!DOCTYPE html><html><head><title>ChromoSelector - jQuery Color Picker plugin : ' . $title . '</title>';
    $html .= '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
    $html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';

    $html .= '<link rel="stylesheet" type="text/css" href="' . $path . '/libs/jquery.mobile-1.2.0.min.css" />';
    $html .= '<link rel="stylesheet" type="text/css" href="' . $path . '/libs/style.css" />';
    $html .= '<link rel="stylesheet" type="text/css" href="' . $libPath . '/chromoselector.css" />';
    $html .= '<link rel="stylesheet" href="' . $path . '/libs/default.min.css">';
    $html .= '<link href="' . $path . '/libs/images/favicon.png" rel="shortcut icon" />';

    $html .= '<script src="' . $libPath . '/jquery-1.8.3.min.js" type="text/javascript"></script>';

    $html .= '<script type="text/javascript">';
    $html .= '$(document).live("mobileinit", function(){';
    $html .= '$.mobile.ajaxEnabled = false;';
    $html .= '});';
    $html .= '</script>';

    $html .= '<script src="' . $path . '/libs/jquery.mobile-1.2.0.min.js" type="text/javascript"></script>';
    if (empty($_GET['SITE'])) {
        $html .= '<script src="' . $libPath . '/chromoselector.min.js" type="text/javascript"></script>';
    } else {
        $html .= '<script src="' . $libPath . '/chromoselector.demo.min.js" type="text/javascript"></script>';
    }
    $html .= '<script src="' . $path . '/demos/custom-color-format.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/demos/icon.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/demos/previews.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/demos/animations.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/demos/display-modes.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/demos/mobile-dialog.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/libs/highlight.pack.js" type="text/javascript"></script>';


    $html .= '<script>';
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
    $html .= '</head>';

    if ($type != 'home') {
        $html .= '<body>';
        $html .= '<div data-role="page" class="type-interior" id="' . $type . '">';
        $html .= '<div data-role="header" data-theme="a">';
        $html .= '<h1>' . $title . '</h1>';
        $html .= '<a href="../index.html" data-icon="home" data-iconpos="notext" data-direction="reverse">Home</a>';
        if (empty($_GET['RELEASE'])) {
            $html .= '<a href="../overview/purchase.html">Buy now</a>';
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

function getFooter() {
    $html  = '</div>';
    $html .= '<div data-role="footer" class="footer-docs" data-theme="c">';
    $html .= '<p>v1.0.1</p>';
    $html .= '<p style="float: right">&copy; 2013 <a href="http://www.chromoselector.com/">www.chromoselector.com</a></p>';
    $html .= '</div>';
    $html .= '</div>';
    $html .= '</body></html>';
    return $html;
}

?>
