<?php

define('PUBLIC_DIR', __DIR__);
define('APP_ENV', $_SERVER['APP_ENV']);
//define('APP_ENV', 'test');

function resourceUrl($publicFilePath, array $params = array()) {
    $filename = __DIR__ . $publicFilePath;
    if (!file_exists($filename)) throw new ErrorException(sprintf('File "%s" not found in the public directory', $filename));
    // Add param to avoid browser cache on file update
    $params['_'] = cacheBust($filename);

    return $publicFilePath . '?' . http_build_query($params);
}

function cacheBust($filename) {
    $time = APP_ENV == 'dev' ? time() : filemtime($filename);
    return date('ymdHis', $time);
}

function apiUrl() {
    $doNAT = ($_SERVER['SERVER_NAME'] == $_SERVER['SERVER_ADDR']);
    $api = [
        'scheme' => $_SERVER['REQUEST_SCHEME'],
        'host' => $doNAT ? $_SERVER['SERVER_NAME'] : str_replace('app', 'api', $_SERVER['SERVER_NAME']),
        'port' => $doNAT ? intval($_SERVER['SERVER_PORT']) + 1 : intval($_SERVER['SERVER_PORT']),
    ];

    return sprintf('%s://%s:%d/v1.0', $api['scheme'], $api['host'], $api['port']);
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
            var apiUrl = '<?= apiUrl(); ?>';
            require.config({
                // Add param to avoid browser cache on file update
                urlArgs: '_=<?= cacheBust(PUBLIC_DIR . '/index.php'); ?>',
            });
        </script>

    </head>

    <body class="noselect">
        <!--[if lt IE 9]>
        <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div id="home-page">
            <div class="pane">
                <h1>Micro ferme</h1>
                <h3>App</h3>
            </div>
        </div>

        <!-- Templates -->
        <? includeTemplates(PUBLIC_DIR . '/js/app'); ?>

    </body>
</html>