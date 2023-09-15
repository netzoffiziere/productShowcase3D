<?php 
    define("DEBUG", true); 
    $currentProduct = $_GET['currentProduct'] ?? 'default';
    $glbPath = "./assets/models/$currentProduct.glb";
    $glbExists = file_exists($glbPath);
    $modelPath = "./js/models/$currentProduct.js";
    $modelExists = file_exists($modelPath);
?>
<!DOCTYPE html>
<html lang=”en”>
<head>    
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Lichtwürfel</title>
	<script src="node_modules/jquery/dist/jquery.min.js"></script>
	<link rel="stylesheet" href="./assets/css/main.css<?php if(DEBUG) echo '?no_cache='.time(); ?>">
	<link rel="stylesheet" href="./node_modules/bootstrap5/src/css/bootstrap.min.css">
	<link rel="stylesheet" href="./node_modules/@fortawesome/fontawesome-free/css/all.min.css">
</head>
<body data-current-product="<?php echo $currentProduct; ?>" data-model-exists="<?php echo $modelExists ? 'true' : 'false'; ?>" data-glb-exists="<?php echo $glbExists ? 'true' : 'false'; ?>" <?php if(DEBUG) echo 'data-debug="true"'; ?>>
	<script type="importmap">
	{
		"imports": {
			"three": "./node_modules/three/build/three.module.js"
		}
	}
	</script>
	<div id="logo" class="absolute">
		<img src="./assets/img/logo_transparent.png" />
	</div>
	<div id="canvas"></div>
	<div class="container-fluid">
		<div class="fixed-bottom bg-dark d-flex justify-content-between p-2 text-white bg-opacity-50">
			<div class="control-panel bg-transparent border-0 flex-grow-0 p-2">
				<h6 class="mb-2">Bewegungssteuerung</h6>
				<div class="mb-2">
					<button id="rotate-left" class="btn btn-sm btn-primary" title="q"><i class="fas fa-undo"></i></button>
					<button id="move-forward" class="btn btn-sm btn-primary" title="w oder Arrow Up"><i class="fas fa-arrow-up"></i></button>
					<button id="rotate-right" class="btn btn-sm btn-primary" title="e"><i class="fas fa-redo"></i></button>
				</div>
				<div class="mb-2">
					<button id="move-left" class="btn btn-sm btn-primary" title="a oder Arrow Left"><i class="fas fa-arrow-left"></i></button>
					<button id="move-back" class="btn btn-sm btn-primary" title="s oder Arrow Down"><i class="fas fa-arrow-down"></i></button>
					<button id="move-right" class="btn btn-sm btn-primary" title="d oder Arrow Right"><i class="fas fa-arrow-right"></i></button>
				</div>
				<div class="mb-2">
					<button id="move-up" class="btn btn-sm btn-secondary" title="r"><i class="fas fa-arrow-alt-circle-up"></i></button>
					<button id="focusButton" class="btn btn-sm btn-primary" title="x"><i class="fas fa-crosshairs"></i></button>
					<button id="move-down" class="btn btn-sm btn-secondary" title="f"><i class="fas fa-arrow-alt-circle-down"></i></button>
				</div>
			</div>
			<div class="info-panel bg-transparent border-0 flex-grow-1 p-2">
				<h4 class="mb-2">Aktuelle Daten</h4>
				<p>Kameraposition: <span id="camera-pos-x" contenteditable="true">0</span>, <span id="camera-pos-y" contenteditable="true">0</span>, <span id="camera-pos-z" contenteditable="true">0</span></p>
				<p>Kamerarotation: <span id="camera-rot-x" contenteditable="true">0</span>°, <span id="camera-rot-y" contenteditable="true">0</span>°, <span id="camera-rot-z" contenteditable="true">0</span>°</p>
				<ul id="object-list">
					<!-- Hier werden die Objekte in der Szene dynamisch hinzugefügt -->
				</ul>
			</div>
			<div class="light-panel bg-transparent border-0 flex-grow-1 p-2">
				<h4 class="mb-2">Lichtsteuerung</h4>
				<ul id="light-list">
					<!-- Hier werden die Lichter in der Szene dynamisch hinzugefügt -->
				</ul>
				<button class="btn btn-primary mt-3"><i class="far fa-lightbulb light-icon"></i> Licht hinzufügen</button>
			</div>
		</div>
	</div>
	<script defer type="module" src="./main.js<?php if(DEBUG) echo '?no_cache='.time(); ?>"></script>
</body>
</html>
