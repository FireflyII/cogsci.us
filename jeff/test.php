<html>

<head>
    <title>PHP Test</title>
</head>

<body>
    <?php echo '<p>Hello World</p>'; ?>
    <?php
 		$fn = htmlspecialchars($_GET["id"]);
 		echo '<h1>' . $fn . '</h1>';
 	?>
 	<form action="test2.php" method="post">
 		<input type="text" name="whatever">
 		<input type="submit" name="whatever">
 	</form>

	<!-- Getting from php to javascript -->
	<script type="text/javascript">
		console.log("I am alive");
		var id="<?php echo $fn ?>"
		alert(id)
	</script>

</body>

</html>