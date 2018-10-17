//Intro

//Common Instructions:

text1 = "Welcome! In this experiment you will be given control of a small robot. To move it, use the arrow keys, or the W,A,S and D keys. Holding the 'shift' key while pressing the arrow or WASD keys will allow you to move faster. ";

//Clear Completion Conditions:

cC = "There are eight red buttons scattered throughout the world map, and your task is to find and press all of them before returning to the starting area and pressing the large blue button. Each button you press will cause a wall somewhere on the map to open, making it possible to access different areas as you progress. Not all of the buttons are readily visible, and some may be impossible to reach initially. A one-way teleporter has been added to aid your exploration.  Nothing in the game can hurt you, so feel free to investigate everything. ";

//Unclear Completion Conditions:

uC = "There are a number of red buttons scattered throughout the world map, and your task is to find and press all of them before returning to the starting area and pressing the large blue button. ";

//Clear Progress

cP = "The number at the top of the screen will indicate how many red buttons you have pressed at any point in the game. ";

//Clear Rules:

cR = "Each button you press will cause a wall somewhere on the map to open, making it possible to access different areas as you progress. Not all of the buttons are readily visible, and some may be impossible to reach initially. A one-way teleporter has been added to aid your exploration.  Nothing in the game can hurt you, so feel free to investigate everything. ";

disp = text1;
if (clearCompletion) {
	disp+=cC;
} else {
	disp+=uC;
}
if (clearProgress) {
	disp+=cP;
}
if (clearRules) {
	disp+=cR;
}

var bootState = {
	create: function() {
		console.log("Intro");
		var loadingImage = document.getElementById("load");
		loadingImage.style.display = 'none';
		// Display descriptive text
		textLabel = game.add.text(40,80,disp,{font: '20px Arial', fill: '#ffffff'});
		textLabel.wordWrap = true;
		textLabel.wordWrapWidth = game.width - 120;
		/*if (clearCompletion) {
			//#ff0000 red
			textLabel.addColor('#ff0000', 232);
			textLabel.addColor('#ffffff', 249);
		}*/

		// We give the player instructions on how to start the game
        startLabel = game.add.text(80, game.world.height - 80,
            'Press the "W" key to start', { font: '22px Arial', fill: '#ffffff' });

        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

        wkey.onDown.addOnce(this.start, this);
	},

	start: function() {
		game.state.start('play');
	}
};