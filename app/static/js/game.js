// Game configuration
var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Set the gravity value as needed
            debug: false // Set to true if you want to show physics bodies
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create the Phaser game instance
var game = new Phaser.Game(config);

// Player variables
var player;
var cursors;

// Preload game assets
function preload() {
    // No assets to preload for this example
}

// Create game objects and initialize the game
function create() {
    // Create the player sprite as a rectangle shape
    player = this.add.rectangle(400, 300, 50, 50, 0xff0000);
    this.physics.world.enable(player);
    player.body.setCollideWorldBounds(true); // Prevent player from going off-screen

    // Enable cursor keys for player movement
    cursors = this.input.keyboard.createCursorKeys();
}

// Update the game state
function update() {
    // Player movement
    if (cursors.left.isDown) {
        player.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 200;
    } else {
        player.body.velocity.x = 0;
    }

    if (cursors.up.isDown) {
        player.body.velocity.y = -200;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 200;
    } else {
        player.body.velocity.y = 0;
    }
}
