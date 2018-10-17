<!DOCTYPE html>
<html>
<head>
<meta charset = "utf-8" />
<title>Buttonworld 2</title>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/phaser.js"></script>
<style>
body {
	padding: 0px;
	margin: 0px;
}
</style>
</head>
<body>
	<?php
		$fn = htmlspecialchars($_GET["n"]);
		$cnd = htmlspecialchars($_GET["cnd"]);
	?>


<script type="text/javascript">
var fname = "<?php echo $fn ?>";
var sname = fname;
var cond = "<?php echo $cnd ?>";
console.log(cond);
switch (cond.length) {
            case 1:
                cond = "000" + cond;
                break;
            case 2:
                cond = "00" + cond;
                break;
            case 3:
                cond = "0" + cond;
                break;
        }
var clearPossibilities = cond[0] == "1";
var clearCourse = cond[1] == "1";
var clearProgress = cond[2] == "1";
var clearGoalreaching = cond[3] == "1";
//var clearPossibilities = "<?php echo $possibilities ?>"=="0";
//var clearCourse = "<?php echo $course ?>"=="0";
//var clearProgress = "<?php echo $progress ?>"=="0";
//var clearGoalreaching = "<?php echo $goal ?>"=="0";

</script>
<div id="gameDiv"> </div>
<script src="js/playState.js"></script>
<script src="js/introState.js"></script>
<script src="js/gameoverState.js"></script>
<script src="js/game.js"></script>
<!-- <script src="js/buttonworld.js"></script>
 --></body>
</html>
