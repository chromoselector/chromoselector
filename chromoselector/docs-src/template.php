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
        if (! empty($_GET['RELEASE'])) {
            $html .= '<a style="position:absolute; width:80px; height:80px; background:url(libs/images/rss.png); top:0; right: 0" href="http://chromoselector.com/feed.xml"></a>';
        }
    }

    return $html;
}

function getFooter($path = '.', $needDialog = false) {
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
    $html .= '<p>v2.1.5</p>';
    $html .= '<p style="float: right">&copy; 2013 <a href="http://chromoselector.com/">chromoselector.com</a></p>';
    $html .= '<div style="clear:both"></div>';
    $html .= '</div>';
    $html .= '</div>';

    if ($needDialog) {
        $html .= '<div id="jqm-dialog" data-role="dialog">
            <div data-role="content">
                <div id="jqm-picker"></div>
                <a id="jqm-save" data-role="button"
                   data-theme="b" href="#">OK</a>
                <a id="jqm-close" data-role="button"
                   href="#">Cancel</a>
            </div>
        </div>';
    }

    $html .= '<script src="' . $libPath . '/jquery-1.10.2.min.js" type="text/javascript"></script>';

    $html .= '<script type="text/javascript">';
    $html .= '$(document).on("mobileinit", function(){';
    $html .= '$.mobile.ajaxEnabled = false;';
    $html .= '});';
    $html .= '</script>';

    $html .= '<script src="' . $path . '/libs/jquery.mobile-1.3.1.min.js" type="text/javascript"></script>';
    if (empty($_GET['SITE'])) {
        $html .= '<script src="' . $libPath . '/chromoselector.min.js" type="text/javascript"></script>';
    } else {
        $html .= '<script src="' . $libPath . '/chromoselector.demo.min.js" type="text/javascript"></script>';
    }
    $html .= '<script src="' . $path . '/demos/demos.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/libs/highlight.pack.js" type="text/javascript"></script>';
    $html .= '<script src="' . $path . '/libs/scripts.js" type="text/javascript"></script>';

    $html .= '</body></html>';
    return $html;
}

?>
