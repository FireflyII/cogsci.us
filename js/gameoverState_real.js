//gameover.js
var gameoverState ={
	create: function(){
		//$.post('after.html',{'fname':sname});
		// $.ajax({
		// 	url: 'after.html',
		// 	data: {'fname': sname, 'num': pressedSum},
		// 	type: 'POST',
		// 	success: function(){
		// 		window.location.href="after.html"
		// 	}
		// });
		var s = "after.html?name="+sname;
		window.location.assign(s);
	},
	update: function(){
		//Nothing here, but there need to be two state-related functions in order for Phaser
		//to consider this to be a valid state.
	}

};