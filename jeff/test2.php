<?php echo '<p>test bare</p>'; ?>
<?php
		$fn = htmlspecialchars($_POST["text_input"]);
		echo '<h1>' . $fn . '</h1>';
	?>
