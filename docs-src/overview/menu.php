<?php

function getOverviewMenu($path = '.', $selected = '') {
    $html  = '<li data-role="list-divider">Overview</li>';

    if (empty($_GET['RELEASE'])) {
        $elms = array(
            'purchase' => 'Purchase',
            'features' => 'Features',
            'screenshots' => 'Screenshots',
            'requirements' => 'Requirements',
            'getting-started' => 'Getting Started',
            'support' => 'Support'
        );
    } else {
        $elms = array(
            'features' => 'Features',
            'screenshots' => 'Screenshots',
            'requirements' => 'Requirements',
            'getting-started' => 'Getting Started',
            'support' => 'Support'
        );
    }

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
