<?php
define('ROOT_DIR', dirname(__DIR__));
define('PUBLIC_DIR', __DIR__);
define('APP_ENV', isset($_SERVER['APP_ENV']) ? $_SERVER['APP_ENV'] : 'prod');
//define('APP_ENV', 'test');

function resourceUrl($publicFilePath, array $params = array()) {
    $filename = __DIR__ . $publicFilePath;
    if (!file_exists($filename)) throw new ErrorException(sprintf('File "%s" not found in the public directory', $filename));
    // Add param to avoid browser cache on file update
    $params['_'] = cacheBust($filename);

    return $publicFilePath . '?' . http_build_query($params);
}

function cacheBust($filename) {
    $time = APP_ENV === 'dev' ? time() : filemtime($filename);
    return date('ymdHis', $time);
}

function apiServerName() {
    return str_replace('app', 'api', $_SERVER['SERVER_NAME']);
}

function apiUrl() {
    $doNAT = ($_SERVER['SERVER_NAME'] === $_SERVER['SERVER_ADDR']);
    $api = [
        'scheme' => $_SERVER['REQUEST_SCHEME'],
        'host' => $doNAT ? $_SERVER['SERVER_NAME'] : apiServerName(),
        'port' => $doNAT ? intval($_SERVER['SERVER_PORT']) + 1 : intval($_SERVER['SERVER_PORT']),
    ];

    return sprintf('%s://%s:%d/v1.0', $api['scheme'], $api['host'], $api['port']);
}

function includeTemplates() {
    $scanDir = PUBLIC_DIR . '/js/app';

    if (APP_ENV === 'dev') {
        echo getTemplates($scanDir);
        return;
    }
    $cacheFilename = ROOT_DIR . '/cache/templates.phtml';
    if (file_exists($cacheFilename)) {
        include $cacheFilename;
        return;
    }
    $content = getTemplates($scanDir);
    file_put_contents($cacheFilename, $content);
    echo $content;
}

function getTemplates($dir, $extension = 'phtml') {
    $content = '';
    $files = array_diff(scandir($dir), array('..', '.'));
    foreach ($files as $file) {
        $path = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($path)) {
            $content .= getTemplates($path, $extension);
        }
        elseif (substr($file, -5) == $extension) {
            $content .= file_get_contents($path) . PHP_EOL . PHP_EOL;
        }
    }

    return $content;
}
?>

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="initial-scale=1,minimum-scale=1,maximum-scale=1,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=yes">
        <title>MicroFarm App</title>

        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="<?= resourceUrl('/favicon/apple-touch-icon.png'); ?>">
        <link rel="icon" type="image/png" sizes="32x32" href="<?= resourceUrl('/favicon/favicon-32x32.png'); ?>">
        <link rel="icon" type="image/png" sizes="16x16" href="<?= resourceUrl('/favicon/favicon-16x16.png'); ?>">
        <link rel="manifest" href="<?= resourceUrl('/favicon/site.webmanifest'); ?>">
        <link rel="mask-icon" href="<?= resourceUrl('/favicon/safari-pinned-tab.svg'); ?>" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#e06b18">

        <!-- Css -->
        <link
            rel="stylesheet"
            href="<?= APP_ENV === 'dev' ? '/css/main.css' : '/build/app-min.css'; ?>"/>

        <!-- Javascript -->
        <script
            type="text/javascript"
            <?= APP_ENV === 'dev' ? 'data-main="js/bootstrap"' : ''; ?>
            src="<?= APP_ENV === 'dev' ? '/vendor/js/require-2.3.6.js' : '/build/app-min.js'; ?>">
        </script>
        <script type="text/javascript">
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
        <?php includeTemplates(); ?>

    </body>
</html>