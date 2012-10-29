<?php

function getDemosMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">API</li>';
    $elms = array(
        'basic-usage' => 'Basic Usage',
        'ui-dialog' => 'jQuery UI Dialog',
        'custom-color-format' => 'Custom Color Formats',
        'icon' => 'Icon',
        'custom-style' => 'Custom Style',
        'previews' => 'Previews'
    );
    foreach ($elms as $key => $value) {
        if ($key == $selected) {
            $html .= '<li data-theme="e">';
        } else {
            $html .= '<li>';
        }
        $html .= '<a href="' . $path . '/demos/' . $key . '.html">' . $value . '</a>';
        $html .= '</li>';
    }
    return $html;
}

?>
