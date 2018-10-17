<?php
session_start();
?>
<html>
<head>
	<meta charset="utf-8" />
	<title>Second Page</title>
	<script>
	function validateForm() {
        var q1 = document.forms["survey2"]["GenderQ"].value;
        var q2 = document.forms["survey2"]["LangQ"].value;
        var q3 = document.forms["survey2"]["CatchQ"].value;
        var q4 = document.forms["survey2"]["hoursplayedgrowingup"].value;
        var q5 = document.forms["survey2"]["hoursplayednow"].value;
        var q6 = document.forms["survey2"]["catchQ2"].value;
        var Qs = [q1, q2, q3, q4, q5, q6];
        for (i = 0; i < 6; i++) {
            if (Qs[i] == "") {
                alert("Question " + (i + 1).toString() + " is blank!");
                return false;
            }
        }
    }
	</script>
<body>
<?php
	$fn = $_SESSION["worker"];
	$Q1 = $_POST['Q1ans'];
	$Q2 = $_POST['Q2ans'];
	$Q3 = $_POST['Q3ans'];
	$Q4 = $_POST['Q4ans'];
	$Q5 = $_POST['Q5ans'];
	$Q6 = $_POST['Q6ans'];
	$Q7 = $_POST['Q7ans'];
	$Q9 = $_POST['Q9ans'];
	$Q10 = $_POST['Q10ans'];
	$Q11 = $_POST['Q11ans'];
	$Q12 = $_POST['Q12ans'];
	$Q13 = $_POST['Q13ans'];
	$Q14 = $_POST['Q14ans'];
	$myfile = fopen('logs/'.$fn.".txt", "a") or die("Unable to open file!");
	fwrite($myfile, $Q1 . "\n" . $Q2 . "\n" . $Q3 . "\n" . $Q4 . "\n" . $Q5 . "\n" . $Q6 . "\n" . $Q7 . "\n" . $Q9 . "\n" . $Q10 . "\n" . $Q11 . "\n" . $Q12 . "\n" . $Q13 . "\n" . $Q14 . "\n");
	fclose($myfile);
?>
<center><h1>Demographic Questions</h1></center>
<form id="survey2" action="survey.php" onsubmit="return validateForm()" method="post" style="width:800px; margin:0 auto">
       	<label>How old are you?</label>
        <select name="age">
        	<option value="18-24">18-24</option>
        	<option value="25-29">25-29</option>
        	<option value="30-34">30-34</option>
        	<option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55+">55+</option>
        </select>
        <br>
        <p>
        <label>What is your gender?</label>
        <br>
        <input type="radio" name="GenderQ" value="male">male<br>
        <input type="radio" name="GenderQ" value="female">female<br>
        <input type="radio" name="GenderQ" value="other">other<br>
        <br>
        <label>Is English your first language?</label>
        <br>
        <input type="radio" name="LangQ" value="yes">yes<br>
        <input type="radio" name="LangQ" value="no">no<br>
        <br>
        <label>How many letters are in the English alphabet?</label>
        <br>
        <input type="radio" name="CatchQ" value="20">20<br>
        <input type="radio" name="CatchQ" value="10">10<br>
        <input type="radio" name="CatchQ" value="58">58<br>
        <input type="radio" name="CatchQ" value="26">26<br>
        <br>
        <label>Growing up, how many hours per week did you play video games?</label>
        <br>
        <input type="radio" name="hoursplayedgrowingup" value="0">zero<br>
        <input type="radio" name="hoursplayedgrowingup" value="<1">less than one<br>
        <input type="radio" name="hoursplayedgrowingup" value="1-2">one to two<br>
        <input type="radio" name="hoursplayedgrowingup" value="2-4">two to four<br>
        <input type="radio" name="hoursplayedgrowingup" value="4-8">four to eight<br>
        <input type="radio" name="hoursplayedgrowingup" value=">8">more than eight<br>
        <br>
        <label>How many hours per week do you play video games now?</label>
        <br>
        <input type="radio" name="hoursplayednow" value="0">zero<br>
        <input type="radio" name="hoursplayednow" value="<1">less than one<br>
        <input type="radio" name="hoursplayednow" value="1-2">one to two<br>
        <input type="radio" name="hoursplayednow" value="2-4">two to four<br>
        <input type="radio" name="hoursplayednow" value="4-8">four to eight<br>
	    <input type="radio" name="hoursplayednow" value=">8">more than eight<br>
        <br>
        <label>Select the number 17</label>
        <br>
        <input type="radio" name="catchQ2" value="64">64<br>
        <input type="radio" name="catchQ2" value="9">9<br>
        <input type="radio" name="catchQ2" value="17">17<br>
        <input type="radio" name="catchQ2" value="39">39<br>
        <input type="radio" name="catchQ2" value="25">25<br>
        <input type="radio" name="catchQ2" value=">100">100<br>
        <br>
        <input type="submit">
</body>
<html>