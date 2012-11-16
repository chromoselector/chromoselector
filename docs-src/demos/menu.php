<?php

function getDemosMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">Demos</li>';
    $elms = array(
        'display-modes' => 'Display Modes',
        'ui-dialog' => 'jQuery UI dialog',
        'custom-color-format' => 'Custom Color Formats',
        'previews' => 'Previews',
        'animations' => 'Animations',
        'icon' => 'Icon'
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
