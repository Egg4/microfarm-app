<?php

define('PUBLIC_DIR', __DIR__);
define('APP_ENV', $_SERVER['APP_ENV']);
//define('APP_ENV', 'test');

function resourceUrl($publicFilePath, array $params = array()) {
    $filename = __DIR__ . $publicFilePath;
    if (!file_exists($filename)) throw new ErrorException(sprintf('File "%s" not found in the public directory', $filename));
    $params['_'] = date('ymdHis', filemtime($filename)); // Add param to avoid browser cache on file update

    return $publicFilePath . '?' . http_build_query($params);
}

function includeTemplates($dir, $extension = 'phtml') {
    $files = array_diff(scandir($dir), array('..', '.'));
    foreach ($files as $file) {
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($path)) {
            includeTemplates($path, $extension);
        }
        elseif (substr($file, -5) == $extension) {
            include $path;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="initial-scale=1,minimum-scale=1,maximum-scale=1,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=yes">
        <title>MicroFarm App</title>

        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="<?= resourceUrl('/favicon/apple-touch-icon.png'); ?>">
        <link rel="icon" type="image/png" sizes="32x32" href="<?= resourceUrl('/favicon/favicon-32x32.png'); ?>">
        <link rel="icon" type="image/png" sizes="16x16" href="<?= resourceUrl('/favicon/favicon-16x16.png'); ?>">
        <link rel="manifest" href="<?= resourceUrl('/favicon/manifest.json'); ?>">
        <link rel="mask-icon" href="<?= resourceUrl('/favicon/safari-pinned-tab.svg'); ?>" color="#5bbad5">
        <meta name="theme-color" content="#ffffff">

        <!-- Css -->
        <link rel="stylesheet" href="<?= resourceUrl('/vendor/css/jquery.mobile-min.css'); ?>" />
        <link rel="stylesheet" href="<?= resourceUrl('/vendor/css/jquery.mobile.datepicker.css'); ?>" />
        <link rel="stylesheet" href="<?= resourceUrl('/vendor/css/jquery.mobile.datepicker.theme.css'); ?>" />
        <link rel="stylesheet" href="<?= resourceUrl('/vendor/css/fontawesome.min.css'); ?>">
        <link rel="stylesheet" href="<?= resourceUrl('/vendor/css/fontawesome-solid.min.css'); ?>">
        <link rel="stylesheet" href="<?= resourceUrl('/css/lib-widget.css'); ?>" />
        <link rel="stylesheet" href="<?= resourceUrl('/css/app-widget.css'); ?>" />
        <link rel="stylesheet" href="<?= resourceUrl('/css/style.css'); ?>" />

        <!-- Javascript -->
        <!--
        <script src="<?= resourceUrl('/vendor/js/jspdf-min.js'); ?>"></script>
        <script src="<?= resourceUrl('/vendor/js/jspdf.plugin.autotable-min.js'); ?>"></script>
        -->
        <script
            data-main="<?= APP_ENV == 'dev' ? 'js/bootstrap' : 'build/bootstrap-built'; ?>"
            src="<?= resourceUrl('/vendor/js/require-min.js'); ?>">
        </script>
        <script>
            var env = '<?= APP_ENV; ?>';
            var cacheBust = '<?= date('ymdHis', APP_ENV == 'dev' ? time() : filemtime(PUBLIC_DIR . '/index.php')); ?>';
            require.config({
                urlArgs: '_=' + cacheBust,
            });
        </script>

    </head>

    <body class="noselect ui-overlay-a">
        <!--[if lt IE 9]>
        <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div id="home-page" data-role="page">
            <h1>Micro Farm</h1>
            <div class="loader">Loading...</div>
        </div>

        <!-- Templates -->
        <? includeTemplates(PUBLIC_DIR . '/js/app/template'); ?>

    </body>
</html>