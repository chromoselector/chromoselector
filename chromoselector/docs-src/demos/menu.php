<?php

function getDemosMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">Demos</li>';
    $elms = array(
        'showcase' => 'Showcase',
        'display-modes' => 'Display Modes',
        'custom-color-format' => 'Custom Color Formats',
        'previews' => 'Color Previews',
        'animations' => 'Animations',
        'icon' => 'Icon Opener',
        'mobile-dialog' => 'jQuery Mobile dialog integration',
        'ui-dialog' => 'jQuery UI dialog integration'
    );
    foreach ($elms as $key => $value) {
        if ($key == $selected) {
            $html .= '<li data-theme="e"';
        } else {
            $html .= '<li>';
        }
        $html .= '<a href="' . $path . '/demos/' . $key . '.html">';
        $html .= $value;
        if ($key == 'showcase') {
            $html .= '<span class="ui-li-count">&nbsp;New&nbsp;</span>';
        }
        $html .= '</a>';
        $html .= '</li>';
    }
    return $html;
}

?>
