<?php

function getApiMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">API</li>';
    $elms = array(
        'properties' => 'Properties',
        'events' => 'Events',
        'methods' => 'Methods',
        'api-object' => 'Api Object',
        'overriding-defaults' => 'Overriding Defaults',
        'color-manipulation' => 'Color Manipulation',
        'theming' => 'Theming'
    );
    foreach ($elms as $key => $value) {
        if ($key == $selected) {
            $html .= '<li data-theme="e">';
        } else {
            $html .= '<li>';
        }
        $html .= '<a href="' . $path . '/api/' . $key . '.html">' . $value . '</a>';
        $html .= '</li>';
    }
    return $html;
}

?>
