var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('background', 'images/game/water.jpeg');
    game.load.image('ground', 'images/game/pf_bubble.jpg');
    game.load.image('bar', 'images/game/pf_short.jpg');
    game.load.image('star', 'images/game/star.png');
    game.load.spritesheet('person', 'images/game//dude.png', 32, 48);

      game.load.audio('jump', 'images/game/Mario-jump-sound.mp3');
}

var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;

var fx;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'background');

        //	Here we set-up our audio sprite
    	  //fx = game.add.audio('jump');
        //fx.allowMultiple = true;

        //fx.addMarker('jump', 10, 1.0);
        //fx.play('ping');

    //  group land items and allow physics
    platforms = game.add.group();
    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    var ledge = platforms.create(450, 300, 'bar');
    ledge.body.immovable = true;

    ledge = platforms.create(-80, 400, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'person');
    game.physics.arcade.enable(player);

    //  Player physics properties.
    player.body.bounce.y = 0.4;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

    // Two animations from tutorial
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    stars = game.add.group();
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 300;
        //  each star has a slightly random bounce value
        star.body.bounce.y = 0.3 + Math.random() * 0.2;
    }
    scoreText = game.add.text(480, 15, 'Total: 0', { fontSize: '30px', fill: 'purple' });
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');


    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //jumping details
    // && player.body.touching.down disables ability to float
    if (cursors.up.isDown)
    {
        var snd = game.add.audio('jump');
        snd.play();
        player.body.velocity.y = -200;
    }

}

function collectStar (player, star) {
    star.kill();
    score += 5;
    scoreText.text = 'Total: ' + score;
}