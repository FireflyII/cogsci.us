<?php
	$data = $_POST['data'];
	$myfile = fopen("testlog.txt","a") or die("Unable to open");
	fwrite($myfile,"\n".$data);
	fclose($myfile);
?>
