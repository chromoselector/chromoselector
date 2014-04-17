<?php

error_reporting(0);

header('Content-Type: application/rss+xml; charset=UTF-8');

$items = array();
$i = 0;
foreach (explode("\n", file_get_contents("CHANGELOG.txt")) as $key => $value) {
	if (preg_match("@^v (\d.\d.\d) - (.*)$@i", $value, $matches)) {
		$i++;
		$timestamp = strtotime($matches[2]);
		if ($timestamp === false) {
			$timestamp = strtotime(date("j M Y"));
		}
		$items[$i] = array(
			"version" => $matches[1],
			"date" => date(DATE_RFC2822, $timestamp),
			"link" => "http://chromoselector.com/#" . $matches[1],
			"changes" => array()
		);
	} else if (preg_match("@  \* (.*)@i", $value, $matches)) {
		$items[$i]["changes"][] = $matches[1];
	}
}


$feed = "";
foreach ($items as $key => $value) {
	$feed .= sprintf(
		"
<item>
  <title>Version %s released</title>
  <description>
    %s
  </description>
  <guid>%s</guid>
  <pubDate>%s</pubDate>
</item>",
		$value["version"],
		htmlentities(implode(",\n    ", $value["changes"])),
		$value["link"],
		$value["date"]
	);
}

printf(
	"<?xml version=\"1.0\" encoding=\"UTF-8\" ?>
<rss version=\"2.0\">
<channel>
 <title>Chromoselector color picker release feed</title>
 <description>By subscribing to this feed you will receive notifications about any new releases of the chromoselector color picker.</description>
 <link>http://chromoselector.com/</link>
 <lastBuildDate>%s</lastBuildDate>
 <pubDate>%s</pubDate>
 <ttl>86400</ttl>%s
</channel>
</rss>",
	date(DATE_RFC2822),
	date(DATE_RFC2822),
	$feed
);



?>