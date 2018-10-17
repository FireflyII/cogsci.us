var game = new Phaser.Game(160, 160, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//var fname = <?php echo htmlspecialchars($_POST[\"fname\"]); ?>;
fname = 'logs/'+fname+'.txt';

//These are the settings, but it's commented out because it's going into the php file for now.
//var clearPossibilities = true;
//var clearCourse = true;
//var clearProgress = true;
//var clearGoalreaching = true;

function preload() {
    //loading the tilemap
    //This is the file that lists where all of the tiles will go, functionally drawing the world.
    game.load.tilemap('combinedemo', 'assets/tilemaps/combinedemo.json', null, Phaser.Tilemap.TILED_JSON);

    //loading the images
    //We need all the source images for the tilemap to use, and to label them so they can be applied later.
    game.load.image('combined', 'assets/images/CombinedSheet.png');
    game.load.image('floor', 'assets/images/FloorTiles.png');
    game.load.image('treeset', 'assets/images/tree.png');
    game.load.image('tunnel', 'assets/images/Tunnel clone.png');
    game.load.image('lava', 'assets/images/Pit3.png');
    game.load.image('bb', 'assets/sprites/BlueButton.png');
    game.load.image('bridge', 'assets/images/BrickBridge.png');
    game.load.image('black','assets/images/Black.png');
    game.load.image('shade','assets/images/Shade.png');
    game.load.image('conveyor1', 'assets/sprites/conveyor1.png');
    game.load.image('pbar1', 'assets/images/pbar1.png');
    game.load.image('pbar2', 'assets/images/pbar2.png');
    game.load.image('db', 'assets/images/Dialog Box.png');
    game.load.image('InstBack', 'assets/images/InstBack.png');
    game.load.image('InstFront', 'assets/images/InstFront.png');
    game.load.image('over1','assets/images/over1.png');
    game.load.image('over2', 'assets/images/over2.png');
    game.load.image('pit','assets/images/pit.png');
    game.load.image('RedLight','assets/images/RedLight.png');
    /* 
     * Images for any objects (things on the object layer to be interacted with)
     * should also be loaded here. There aren't any at the moment, but this is where
     * they would go.
     */

    //load the sprites
    //The player uses a sprite, rather than an image. Mainly this is so that it can be animated.
    // -- If it were a static image, maybe it wouldn't need to be a sprite? This is still fuzzy
    // -- in regards to the object layer vs tile layer stuff...
    game.load.spritesheet('player', 'assets/sprites/probe1.png', 32, 32);
    game.load.spritesheet('openable', 'assets/sprites/wallOpening2.png', 32, 32);
    game.load.spritesheet('blueButton', 'assets/sprites/BlueButton.png', 32, 32);
    game.load.spritesheet('open2', 'assets/sprites/LowerWallOpener.png', 32, 32);
    game.load.spritesheet('redButton', 'assets/sprites/RedButton.png', 32, 32);
    game.load.spritesheet('conveyor1', 'assets/sprites/conveyor1.png',32,32);
    game.load.spritesheet('scroll','assets/sprites/Scroll.png',32,32);
    
    // load the font to use so it's legible
    game.load.bitmapFont('nokia16', 'assets/fonts/nokia16.png', 'assets/fonts/nokia16.xml');
}

function create() {
    game.time.events.loop(Phaser.Timer.SECOND * 10, logData, this);
    //Set up the game environment
    game.stage.backgroundColor = "#fff";
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //create a 'map' object from the tilemap loaded earlier
    map = game.add.tilemap('combinedemo');

    //add the tile sets loaded earlier to the map, basically telling it which
    //image (loaded above) goes with which named tileset in the tilemap file.
    // -- This seems redundant to me, since the path to the image file is already
    // -- in the json file, but so be it.
    map.addTilesetImage('CombinedSheet', 'combined');
    map.addTilesetImage('FloorTiles', 'floor');
    map.addTilesetImage('tree', 'treeset');
    map.addTilesetImage('Tunnel', 'tunnel');
    map.addTilesetImage('Pit3', 'lava');
    map.addTilesetImage('BlueButton', 'bb');
    map.addTilesetImage('BrickBridge','bridge');
    map.addTilesetImage('Black','black');
    map.addTilesetImage('conveyor1','conveyor1');
    map.addTilesetImage('pit','pit');
    map.addTilesetImage('RedLight','RedLight');

    //create layers
    /* The order matters here. The background comes first, with everything
     * that's going to be behind everything else, with no interaction. The blocked
     * layer comes next, sitting on top of (or in front of) the background layer,
     * and consists of any walls/obstacles we'll be having the player be 'blocked' by.
     * Next is the object layer, which is a little different (more later), where the player
     * is, and finally an upper layer (placed later in the code so it will be after the object layer)
     * that works just like the background layer (no interactions) but sits on top of everything else.
     * All of these layers can be named anything, and how they are used (interaction or not)
     * is determined here in Phaser, but they'll be drawn in the order they're listed in this code.
     */
    backgroundLayer = map.createLayer('backgroundLayer'); //the 'backgroundLayer' is named in the tilemap
    blockedLayer = map.createLayer('blockedLayer'); // ""
    // *** Why do we need to create the background and blocked layers, but not the object layer? ***
    // *** It works without doing so, and doesn't if we try...
    //objectLayer = map.createLayer('objectLayer');
    //collision on blockedLayer
    map.setCollisionBetween(1, 2000, true, 'blockedLayer'); // I don't know what these parameters are

    
    //resize the game world to match the layer dimensions
    // -- I *think* this makes it zoom in? I'm not sure...
    backgroundLayer.resizeWorld();

    //insert the button(s)
    var r3 = findObjectsByType('button', map, 'objectLayer');
    button = game.add.sprite(r3[0].x, r3[0].y, 'blueButton');
    game.physics.arcade.enable(button);

    //place the openable wall, which is also a sprite on the object layer*
    walls = game.add.group();
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.ARCADE;

    /* Create red buttons.
     * This makes a group for the red buttons called rBs, and creates
     * new sprites for each 'redButton' instance found on the object layer.
     * It adjusts the size, sets the button so it won't move, and tacks
     * on the extra parameters for the wall coordinates to open.
     */
    rBs = game.add.group();
    rBs.enableBody = true;
    rBs.physicsBodyType = Phaser.Physics.ARCADE;

    var rBi = findObjectsByType('redButton', map, 'objectLayer');
    rBi.forEach(function(bt) {
        var rB = rBs.create(bt.x, bt.y + bt.properties.height, 'redButton');
        rB.width = bt.properties.width;
        rB.height = bt.properties.height;
        rB.opensX = bt.properties.opensX;
        rB.opensY = bt.properties.opensY;
        rB.LED = map.getTile(bt.properties.LEDX, bt.properties.LEDY, 1);
        rB.body.immovable = true;
    });
    var r2 = findObjectsByType('secret', map, 'objectLayer');
    // openwall = game.add.sprite(r2[0].x, r2[0].y, 'openable');
    // game.physics.arcade.enable(openwall);
    // openwall.body.immovable = true;
    // openanimation = openwall.animations.add('opening');
    createWall(r2[0].x, r2[0].y);

    var r4 = findObjectsByType('secret2', map, 'objectLayer');
    openwall2 = game.add.sprite(r4[0].x, r4[0].y, 'open2');
    game.physics.arcade.enable(openwall2);
    openwall2.body.immovable = true;
    openanimation2 = openwall2.animations.add('opening2');
    
    //create the player
    //Basically, search for the 'playerStart' object, of which there should
    //be only one, and use its position as the starting coordinates for the player
    //sprite. 
    var result = findObjectsByType('playerStart', map, 'objectLayer');
    player = game.add.sprite(result[0].x, result[0].y, 'player');
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.5, 0.5);

    //follow the player with the camera
    game.camera.follow(player);
    //the line after this one can be used as an alternative to the one above for smoother panning
    //game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //enable cursor keys for player movement
    cursors = game.input.keyboard.createCursorKeys();

    //also enable wasd for player movement
    wasd = game.input.keyboard.addKeys({ 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D });

    //enable spacebar for use in closing the instruction window.
    k=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    k.onDown.add(closeInst,this);

    //add the "rolling" animation 
    player.animations.add('rolling');

    //add the upper layer (see above)
    upperLayer = map.createLayer('upperLayer');

    //add the blocked out layer
    darkLayer = map.createLayer('darkLayer');
    //********* Create an array for data logging ********
    hist = [];
    
    //create a block that is locked to the player, but larger,
    //and destroys the dark tiles when they collide.
    see = player.addChild(game.make.sprite(0,0,'shade'));
    see.anchor.setTo(0.5,0.5);
    see.scale.setTo(2,2);
    game.physics.arcade.enable(see);
    see.alpha=0;

    //not sure about this...
    //map.setCollisionBetween(1,2000,true,'darkLayer');
    //map.setTileIndexCallback(79, lightup, this);
    
    //There are apparently issues with collisions using more than one layer,
    //but this seems to do the trick. Basically, we're going to assign
    //the collision action to every tile on the layer. Another way to go, perhaps,
    //would be check the tiles surrounding the player with every update and remove them,
    //but I actually think this might be cleaner.
    ts = darkLayer.getTiles(0,0,1280,1280); //return a list of all tiles within the rectangle formed by the pixel coordinates given (the whole world, here)
    ts.forEach(function(tl){
        tl.setCollisionCallback(lightup, this);
    });

    //This isn't fully what I want to do, but it's a step in the right direction.
    //This creates a limited window within the field of view, in which the player can
    //move around. At the edge of that window, the camera will slide along, keeping
    //the player in view. The point of this is to be able to use a portion of the screen
    //for other things (like a progress bar, inventory, etc.) without getting in the
    //way of the game. It's not ideal though, for a few reasons. 1.) It doesn't actually
    //prevent the player from going further, just drags the camera with them. At the end of
    //the actual game world, the player can move outside this window. 2.) Without this line
    //the player is centered on screen at all times (except when near the edge of the world).
    //With this line, they roam around the screen until hitting the virtual sides. It's not
    //necessarily a bad thing, but it is a difference. Actually, scratch that, it is a bit of
    //a problem, since the upper walls will always be just out of view now... that could be fixed
    //by changing the rectangle, I guess, but still...not ideal.

    //game.camera.deadzone = new Phaser.Rectangle(10, 10, 140, 110)

    //Create the progress bar
    //Both the progress bar and the map covering can be running in all cases,
    //but with their visibility toggled for each condition. That way, there shouldn't
    //be any performance differences, because the same code will be running.
    
    //pouter = progress bar, outer part (the outline)
    //pinner = progress bar, inner part (the shading)
    //pperc = the percentage of the bar to fill...
    pouter = game.add.sprite(0,0,'pbar1');
    pinner = game.add.sprite(0,0,'pbar2');
    pouter.scale.setTo(1,.5);
    pinner.scale.setTo(1,.5);
    pouter.fixedToCamera = true;
    pinner.fixedToCamera = true;
    pouter.cameraOffset.setTo(0, -15);
    pinner.cameraOffset.setTo(0, -15);
    pperc = .1;
    pinner.scale.x = pperc;

    mstate = 1; //movement state (dialog boxes versus game movement)
    showInstructions();

    //We'll need a simpler way to toggle the different game conditions, so consider this a placeholder
    //for now. It will, however, influence which end text is shown.
    condition = 4;
}

function createWall(bigX, bigY) {
    var wall = walls.create(bigX, bigY, 'openable');
    wall.animations.add('opening');
    wall.body.immovable = true;
}

function createWallTile(littleX, littleY) {
    map.removeTile(littleX, littleY, 1);
    var wall = walls.create(littleX * 32, littleY * 32, 'openable');
    wall.animations.add('opening');
    wall.body.immovable = true;
    return wall;
}
/*
 * This function comes from a tutorial, but the Phaser documentation hints at needing
 * to do this one way or another, so we'll keep it.
 * 
 * Basically, this function is passed a tag for the 'type' property that
 * is added to objects in Tiled to identify them as one kind or another (item, door, etc.)
 * along with the map object, and the name of layer to look in. It returns an array
 * of all the objects it finds that match.
 */
function findObjectsByType(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
        if (element.properties.type === type) {
            // Phaser uses top left, Tiled bottom left, so adjustments are made here...
            element.y -= map.tileHeight;
            result.push(element);
        }
    });
    return result;
}

/*
 * This also comes from the tutorial, and may be replaced with Phaser's built-in
 * Tilemap.createFromObjects later once I figure out what the difference is...
 */
function createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
    //copy properties to the sprite
    Object.keys(element.properties).forEach(function(key) {
        sprite[key] = element.properties[key];
    });
}

//Save to a file.
function saveToFile(data){
    jsonString = JSON.stringify(data);
    $.ajax({
        url: 'save.php',
        data: {'jsonString':jsonString, 'fname':fname},
        type: 'POST'
    });
}

//Write the data recorded so far, and clear the way for more.
function logData(){
    saveToFile(/*{
        x: Math.round(player.x),
        y: Math.round(player.y),
        time: game.time.now,
        up: cursors.up.isDown,
        down: cursors.down.isDown,
        left: cursors.left.isDown,
        right: cursors.right.isDown,
        w: wasd.up.isDown,
        s: wasd.down.isDown,
        a: wasd.left.isDown,
        d: wasd.right.isDown
        // shift key to be added later, since right now it looks like a pain to do...
        // it's a modifier for every key rather than a separable thing. Basically you
        // have up, up+shift, down, down+shift, etc....
    }*/
    hist
    );
    hist=[];
}

function update() {
    //This will probably move to the 'create' function once deployed, but is here for testing
    //purposes so that we can toggle things while the game is running.
    if (clearProgress){
        pouter.visible=true;
        pinner.visible=true;
    }else {
        pouter.visible=false;
        pinner.visible=false;
    }
    if (clearCourse){
        darkLayer.visible=false;
    }else {
        darkLayer.visible=true;
    }
    //********* Log the following on every update:
    //      player's x coordinate
    //      player's y coordinate
    //      the game's timestamp
    //      each of the input keys (wasd, shift, and arrow keys) statuses
    //      ....

    hist.push({
        x: Math.round(player.x),
        y: Math.round(player.y),
        time: game.time.now,
        up: cursors.up.isDown,
        down: cursors.down.isDown,
        left: cursors.left.isDown,
        right: cursors.right.isDown,
        w: wasd.up.isDown,
        s: wasd.down.isDown,
        a: wasd.left.isDown,
        d: wasd.right.isDown
    });
    

    //player movement
    //My previous method set the velocity to specific number when
    //a key was pressed, and set it to zero otherwise. This version
    //continuously resets the velocity to zero, and adds a specific amount
    //if a key is held down. One major difference between the two strategies
    //is that I don't think this one will have the same "glitch" movement as mine,
    //but I would also imagine that this is slightly more processor intensive (only a bit, but still...)

    //There's another difference between the two methods for handling curosr movement.
    //In my previous version, the animation would keep going until a button was lifted,
    //while in this one it stops on every loop... It does bring up an interesting question about
    //animations though... telling an animation to 'play' when it's already playing doesn't do anything?
    //it doesn't interrupt or start over? I'd need a longer (and more distinctive) animation to test this.

    /*
    *   Another 'glitch' I've come across:
    *   If you hold down shift and a direction (with either the arrows or wasd) and let go
    *   of the shift key, you'll keep moving at the faster pace until you let go of the direction.
    *   If you then use the other set of keys for that direction (ie if you had held down up, and now use w),
    *   you will continue to move at the faster pace in that direction, with no shift key required.
    *   This remains in effect until you press the original direction again!
    */
    //A simpler way to adjust animation speed later...
    var anispeed = 40;
    var movespeed = 50;
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;
    player.animations.stop();

    //The following line does everything contained in the commented out section right after it.
    //I put it in to see if it would make a difference in how fast the game runs...
    
    if (mstate==1){
    cursors.up.isDown || wasd.up.isDown ? ((cursors.up.shiftKey || wasd.up.shiftKey) && (movespeed = 100), player.body.velocity.y -= movespeed, player.angle = 0, player.animations.play("rolling", anispeed, !0)) : cursors.down.isDown || wasd.down.isDown ? ((cursors.down.shiftKey || wasd.down.shiftKey) && (movespeed = 100), player.body.velocity.y += movespeed, player.angle = 180, player.animations.play("rolling", anispeed, !0)) : cursors.left.isDown || wasd.left.isDown ? ((cursors.left.shiftKey || wasd.left.shiftKey) && (movespeed = 100), player.body.velocity.x -= movespeed, player.angle = -90, player.animations.play("rolling", anispeed, !0)) : (cursors.right.isDown || wasd.right.isDown) && ((cursors.right.shiftKey || wasd.right.shiftKey) && (movespeed = 100), player.body.velocity.x += movespeed, player.angle = 90, player.animations.play("rolling", anispeed, !0));
    } else if (mstate==2){
        if (boxText.bottom>box.bottom){
            scrollDown.visible=true;
        }else {
            scrollDown.visible=false;
        }
        if (boxText.top<box.top){
            scrollUp.visible=true;
        }else{
            scrollUp.visible=false;
        }
        if (cursors.down.isDown || wasd.down.isDown){
            if (boxText.bottom>box.bottom){
                boxText.y-=1; //let it be jumpy for the moment, we'll smooth it out later
            }
        } else if (cursors.up.isDown || wasd.up.isDown){
            if (boxText.top<box.top){
                boxText.y+=1;
            }
        }
    } else if (mstate==3){
        if (game.input.activePointer.isDown){
            console.log("Here's where we'll end it, somehow.");
        }
    }
    /*if (cursors.up.isDown || wasd.up.isDown) {
        if (cursors.up.shiftKey || wasd.up.shiftKey) {
            movespeed = 100;
        }
        player.body.velocity.y -= movespeed;
        player.angle = 0;
        player.animations.play('rolling', anispeed, true);

    } else if (cursors.down.isDown || wasd.down.isDown) {
        if (cursors.down.shiftKey || wasd.down.shiftKey) {
            movespeed = 100;
        }
        player.body.velocity.y += movespeed;
        player.angle = 180;
        player.animations.play('rolling', anispeed, true);
    } else if (cursors.left.isDown || wasd.left.isDown) {
        if (cursors.left.shiftKey || wasd.left.shiftKey) {
            movespeed = 100;
        }
        player.body.velocity.x -= movespeed;
        player.angle = -90;
        player.animations.play('rolling', anispeed, true);
    } else if (cursors.right.isDown || wasd.right.isDown) {
        if (cursors.right.shiftKey || wasd.right.shiftKey) {
            movespeed = 100;
        }
        player.body.velocity.x += movespeed;
        player.angle = 90;
        player.animations.play('rolling', anispeed, true);
    }*/

    // One of the two major reasons for this test is next: collision based on content
    // This should work almost, if not exactly, the same was a groups, but be based on
    // which layer an object is in rather than which group... or maybe which layer *and* which group?

    game.physics.arcade.collide(player, blockedLayer, hitwall, null); //collide with anything on the blocked layer, no matter what it is.

    //game.physics.arcade.collide(player, openwall, wallopen, null); // when hit, open the wall
    game.physics.arcade.collide(player, walls, wallopen3, null);
    game.physics.arcade.collide(player, openwall2, null, null);

    //knock out the dark tiles when the player's aura collides with them
    game.physics.arcade.collide(see, darkLayer, lightup, null);
    

    game.physics.arcade.overlap(player, rBs, redWall, null);
    // game.physics.arcade.collide(player, trickwalls, wallopen3, null);
    // //game.physics.arcade.overlap(player, items, collect, null); //overlap the player with things in the item group? I have to look at this again...
    //game.physics.arcade.overlap(player, doors, enterDoor, null); //overlap the player and doors (presumably this means an unlocked door, since we'd want collide for a locked one, right?)

    //There's almost certainly a better way to do this, but for now I'm just trying
    //to see if I can do it at all. I want the button to be pressed down when the player
    //is on top of it, and up otherwise.
    if (button.overlap(player)) {
        button.frame = 1;
        wallopen2(player, openwall2);
        player.x=111;
        player.y=110;
        gameOver();
    } else {
        button.frame = 0;
    }
   // render();

}

function lightup(see, darktile){
    darktile.alpha=0;
    map.layers[3].dirty = true;
}

//when a player hits a red button, flip the button so it's pressed down,
//check whether the coordinates associated with this button have the right
//wall tile, and if so, make a new wall-opening sprite in its place, animate it,
//and update the floor tile too.
function redWall(player, button) {
    button.frame=1;
    button.LED.index=118;
    if (map.hasTile(button.opensX, button.opensY, 1)) {
        if (map.getTile(button.opensX, button.opensY, 1).index == 24) {
            var wall = createWallTile(button.opensX, button.opensY);
            wallopen3(player, wall);
            map.layers[0].dirty = true;
        }
    }


}

function wallopen3(player, wall) {
    //stop the player's motion temporarily
    //player.body.velocity.x = 0;
    //player.body.velocity.y = 0;
    //get the tile location of the wall (before we destroy it)
    var temp = map.getTileWorldXY(wall.x, wall.y, 32, 32, 0);
    // more importantly, get the tile right below it (and on the background layer)
    var temp2 = map.getTileBelow(0, temp.x, temp.y);
    if (temp2.index == 13) {
        temp2.index = 10;
    } else if (temp2.index == 8) {
        temp2.index = 5;
    }
    //animate the wall opening up
    wall.animations.play('opening', 4, false, true); // play the animation at 4 fps, don't loop, and destroy the sprite at the end
    console.log('opening the wall');
    //replace the tile on the floor to get rid of the shadow...

    //replace the floor tile so the shadow is gone.
    //for the moment, these are specific tile locations because there's only one
    //instance. I'll try to generalize it shortly.
    //map.putTile(map.getTile(13, 8, 0), 13, 7, 0); //take the tile at 13,8 on layer 0 (the background)
    //and put a copy at 13,7 also layer 0.
    
    //give the player a boost to the progress bar
    
    pperc += .1;
    pinner.scale.x = pperc;
}

function wallopen2(player, wall) {
    //player.body.velocity.x = 0;
    //player.body.velocity.y = 0;
    openwall2.animations.play('opening2', 4, false, true);
    console.log('opening other wall');
    map.getTile(11, 13, 0).index = 6;
    //var te = map.getTileBelow(wall.x, wall.y, 0);
    //te.index = te.index-1;
}

function wallopen(player, wall) {
    //stop the player's motion temporarily
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    //animate the wall opening up
    openwall.animations.play('opening', 4, false, true); // play the animation at 4 fps, don't loop, and destroy the sprite at the end
    console.log('opening the wall');
    //replace the floor tile so the shadow is gone.
    //for the moment, these are specific tile locations because there's only one
    //instance. I'll try to generalize it shortly.
    map.putTile(map.getTile(13, 8, 0), 13, 7, 0); //take the tile at 13,8 on layer 0 (the background)
    //and put a copy at 13,7 also layer 0.
}
/*
 * In the above function I copied a floor tile up one space to get rid of the shadow.
 * To be more extendible, though, I'd want to be able to check which tile image is being
 * used in a spot, and change its image accordingly. This will require knowing more about
 * the properties of a tile in order to identify the contents, and how to place a tile from
 * the tileset, not just from a nearby tile! These aren't exactly high priorities right now,
 * especially since what I've done so far does work, but it would be nice to get to at some point.
 */

/*
 * Ok, I've got most of it, just haven't implemented it yet. Here's the idea:
 * use map.getTileBelow (or left, right, etc.) to isolate the desired tile. Then,
 * use <tile>.index = <tile>.index - 1 to shift its image to one lower on the sheet.
 * This should work if the tilesheet is arranged properly (meaning in this case that
 * every un-shaded version of a tile is placed right before the shaded one we're using).
 * The main caveat here is that it apparrently doesn't take effect (i.e. doesn't redraw)
 * until that tile has scrolled out of view and back. Still, it's actually a pretty simple
 * way to be able to swap out adjacent tiles no matter where they're being placed in the map!
 */
function hitwall(player, wallpart) {
    //testing to see if we can identify parts of the wall when we run into them!
    console.log('Ran into wall at X:' + wallpart.x + ' Y:' + wallpart.y);
    //for added fun, let's check if we hit a particular wall, and if so, jump the player somewhere else!
    if (wallpart.x == 15 && wallpart.y == 16) {
        game.camera.shake(0.1, 100);
        player.x = 626.5;
        player.y = 490.5;
    }
    if (wallpart.x == 10 && wallpart.y == 27) {
        game.camera.shake(0.1, 100);
        player.x = 150;
    }
    if (wallpart.x == 5 && wallpart.y == 27) {
        game.camera.shake(0.1, 500);
        player.x = 1032;
        player.y = 914;
    }
    //Another way to do the above might be to set collision/overlap calls to
    //specific map tiles... just a thought.
}

function openDialog(x,y,text){
    //open a dialog box at given coordinates, or default if none are given
   /* if (x===undefined){
        x = 336;
    }
    if (y===undefined){
        y = 224;
    } */
    void 0===x&&(x=416),void 0===y&&(y=255);
    db = game.add.image(x,y,'db');
    db.anchor.setTo(0.5,0.5);
    db.scale.setTo(0,0);
    jv = game.add.tween(db.scale).to({x:1,y:1},500,"Linear",true,0,0,false);
    //jva = game.add.tween(db.scale).to({x:0,y:0},500,"Linear",true,0,0,false);
    //this part creates a mask around the dialog box, with the expectation of
    //somehow adding scrolling text to it... I want to be able to add
    //text as an argument to the openDialog function, but there are apparently
    //a few hurdles to jump through first, namely dealing with sizing and placement
    //mask = game.add.graphics(db.x-db.width/2,db.y-db.height/2);
    //mask.beginFill(0xffffff);
    //mask.drawRect(0,0,db.width,db.height);
    //db.mask=mask;
    //jv.onComplete.addOnce(function(){text = game.add.bitmapText(db.x-db.width/2+6,db.y-db.height/2+6,'nokia16',text,16);
    jv.start();
    //db.inputEnabled=true;
    //db.events.onInputDown.add(function(){jva.start();db.destroy();});
    //text.maxWidth=160;});
}

function showInstructions(){
    //335,224
    box = game.add.image(415,272,'InstBack');
    box.anchor.setTo(0.5,0.5);
    box.scale.setTo(0,0);
    bxup = game.add.tween(box.scale).to({x:1,y:1},500,"Linear",false,0,0,false);
    bxup.onComplete.add(function(){
    //The dialog box is open, now to make it into a mask
    boxmask = game.add.graphics(335,224);
    boxmask.beginFill(0xffffff);
    boxmask.drawRect(0,0,160,96);
    //load the text for the box
    boxText = game.add.image(335,224,'InstFront');
    boxText.mask=boxmask;
    mstate=2; 
    scrollDown = game.add.sprite(475,300,'scroll');
    scrollDown.scale.setTo(0.5,0.5);
    scrollDown.animations.add('scrl');
    scrollDown.animations.play('scrl',2,true,false);   
    scrollUp = game.add.sprite(490, 244,'scroll');
    scrollUp.scale.setTo(0.5,0.5);
    scrollUp.angle=180;
    scrollUp.animations.add('scrl');
    scrollUp.animations.play('scrl',2,true,false);
    },this);
    bxup.start();

}

function closeInst(){
    boxText.destroy();
    bxdown = game.add.tween(box.scale).to({x:0,y:0},500,"Linear",true,0,0,false);
    //bxdown.onComplete.add(box.destroy);
    boxmask.destroy();
    scrollUp.destroy();
    scrollDown.destroy();
    mstate=1;
}


function gameOver(){
    box = game.add.image(112,136,'InstBack');
    box.anchor.setTo(0.5,0.5);
    box.scale.setTo(0,0);
    bxup = game.add.tween(box.scale).to({x:1,y:1},500,"Linear",false,0,0,false);
    bxup.onComplete.add(function(){
    if (clearGoalreaching){
        boxText = game.add.image(box.left,box.top,'over2');
    } else {
        boxText = game.add.image(box.left,box.top,'over1');
    }
    mstate=3;    
    },this);
    bxup.start();
}
function render() {

    //game.debug.text(player.width, 32, 32);
    //game.debug.geom(player.getBounds());
    game.debug.font="10px Courier";
    game.debug.lineHeight=8;
    game.debug.spriteInfo(player,0,10);
}