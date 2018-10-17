<?php
session_start();
?>
<html>
<body>
Thank you for your participation and feedback. Your responses have been successfully recorded!
<?php
	$fn = $_SESSION["worker"];
	$Q15 = $_POST['GenderQ'];
	$Q16 = $_POST['LangQ'];
	$Q17 = $_POST['CatchQ'];
	$Q18 = $_POST['hoursplayedgrowingup'];
	$Q19 = $_POST['hoursplayednow'];
	$Q20 = $_POST['catchQ2'];
	$Q21 = $_POST['age'];
	$myfile = fopen('logs/'.$fn.".txt", "a") or die("Unable to open file!");

	fwrite($myfile, $Q15 . "\n" . $Q16 . "\n" . $Q17 . "\n" . $Q18 . "\n" . $Q19 . "\n" . $Q20 . "\n" . $Q21);
	fclose($myfile);
	$complete = $_SESSION["completion"];
	$foo = `python csvcomplete.py {$fn}`;
	echo "<br><p>Please return to Mechanical Turk and enter the following code to complete your participation: <br><br>" . $complete;
	//echo $foo;
	?>


</body>
</html>