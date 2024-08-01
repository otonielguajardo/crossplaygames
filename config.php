<?php

$data = json_decode(file_get_contents('./games.json'), true);
$games = collect($data['games']);
$platforms = $games->pluck('platforms')->flatten()->unique();

return [
	'production' => false,
	'baseUrl' => '',
	'repoUrl' => 'https://github.com/otonielguajardo/crossplaygames',
	'title' => 'Crossplay Games',
	'description' => 'Filter by platform to easily find crossplay games that are compatible with your preferences.',
	'collections' => [],
	'data' => [
		'games' => $games,
		'platforms' => $platforms
	]
];
