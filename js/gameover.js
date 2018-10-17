//gameover.js
var gameoverState ={
	create: function(){
		$.ajax({
			url: 'after.html',
			data: {'fname': sname, 'num': pressedSum},
			type: 'POST'
			success: function(){
				window.location.href=
			}
		});
		// var s = "after.html?name="+sname+"&found="+pressedSum;
		// window.location.assign(s);
	},
	update: function(){
		//Nothing here, but there need to be two state-related functions in order for Phaser
		//to consider this to be a valid state.
	}

};