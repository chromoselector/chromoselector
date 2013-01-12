<?php

function getDemosMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">Demos</li>';
    $elms = array(
        'display-modes' => 'Display Modes',
        'ui-dialog' => 'jQuery UI dialog integration',
        'custom-color-format' => 'Custom Color Formats',
        'previews' => 'Color Previews',
        'animations' => 'Animations',
        'icon' => 'Icon opener',
        'mobile-dialog' => 'jQuery Mobile dialog integration'
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
