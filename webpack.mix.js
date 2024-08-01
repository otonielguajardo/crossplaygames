const mix = require('laravel-mix');
require('laravel-mix-jigsaw');

mix.disableSuccessNotifications();
mix.setPublicPath('source/assets/build');

mix.jigsaw()
    .css('source/_assets/css/main.css', 'css')
    .options({
        processCssUrls: false,
    })
    .version();
