<!DOCTYPE html>
<html>
<head>
<meta charset = "utf-8" />
<title>Name Test</title>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/phaser.js"></script>
</head>
<body>
	<?php
		$fn = htmlspecialchars($_POST["name"]);
		$python = `python python.py {$fn}`;
                echo "Name passed: " . $fn . "<br>";
                echo "Return from python: " . $python . "<br>";
                echo strcmp($python, 'TAKEN');
		if (strcmp($python,'TAKEN') == 1){
			echo "That name is in use.";
		} else if (strcmp($python,"AVAIL") == 1){
			echo "That name is ok.";
		} else {
                        echo "It's not working";
                        }
	?>
</body>
</html>