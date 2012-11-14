<?php

function getOverviewMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">Overview</li>';
    $elms = array(
        'purchase' => 'Purchase',
        'features' => 'Features',
        'requirements' => 'Requirements',
        'support' => 'Support'
    );

    foreach ($elms as $key => $value) {
        if ($key == $selected) {
            $html .= '<li data-theme="e">';
        } else {
            $html .= '<li>';
        }
        $html .= '<a href="' . $path . '/overview/' . $key . '.html">' . $value . '</a>';
        $html .= '</li>';
    }
    return $html;
}

?>
