let gameScene = new Phaser.Scene('Game')

// Game configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    scene: gameScene
    
    /*
    {
        preload: preload,
        create: create,
        update: update
    }
    */
    ,
    physics: {
        default: 'arcade',
        arcade: { // Set the gravity value as needed
            debug: true // Set to true if you want to show physics bodies
        }
    }
};

// Create the Phaser game instance
let game = new Phaser.Game(config);

gameScene.preload = function() {
    this.load.image("kirby", "assets/kirby.png")
    this.load.image("ground", "assets/ground.png")
}

gameScene.create = function() {
    this.add.sprite(100, 100, "kirby");
    this.add.sprite()
}

/*
// kirby variables
var kirby;
var cursors;

// Preload game assets and sounds
function preload() {
    this.load.image("kirby", "kirby.jpeg")
    this.load.image("ground", "ground.jpeg")
    // No assets to preload for this example
}

// Create game objects and initialize the game
function create() {
    // Create kirby sprite
    this.add.sprite(100, 100, "kirby");
    let kirby = this.physics.add.sprite(this.sys.game.config.width/2, this.sys.game.config.height/2, "kirby")
    kirby.setGravityY(100);

    let groundX = this.sys.game.config.width/2;
    let groundY = this.sys.game.config.height * .95;
    let ground = this.physics.add.sprite(groundX, groundY, "ground");
    ground.displayWidth = this.sys.game.config.width;

    this.physics.add.collider(kirby, ground)
    ground.setImmovable();
    //this.physics.world.enable(kirby);
    //kirby.body.setCollideWorldBounds(true); // Prevent kirby from going off-screen

    // Enable cursor keys for kirby movement
    cursors = this.input.keyboard.createCursorKeys();
}

// Update the game state
function update() {
    // kirby movement
    if (cursors.left.isDown) {
        kirby.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
        kirby.body.velocity.x = 200;
    } else {
        kirby.body.velocity.x = 0;
    }

    if (cursors.up.isDown) {
        kirby.body.velocity.y = -200;
    } else if (cursors.down.isDown) {
        kirby.body.velocity.y = 200;
    } else {
        kirby.body.velocity.y = 0;
    }
}

*/