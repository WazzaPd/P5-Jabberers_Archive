var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "canvas",
    physics: {
        default: "arcade",
        arcade: { 
            gravity: { y: 1000 }, // Set the gravity value as needed
            debug: true // Set to true if you want to show physics bodies
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var kirby;
var ground;

function preload() {
    //Preload sprites
    this.load.image("kirby", "assets/kirby.png")
    this.load.image("ground", "assets/ground.png")
}

function create() {
    //Create kirby
    kirby = this.add.sprite(100, 100, "kirby");

    //Make bouncy kirby
    kirby.setBounce(0.2);

    //Laws of Physics
    kirby.setCollideWorldBounds(true);

    //Create floating islands
    islands = this.physics.add.staticGroup();
    islands.create(0, 200, "ground");
    islands.create(400, 400, "ground");

    //Let kirby crash into the wall
    this.physics.add.collider(kirby, islands);

    //Make camera focus kirby
    this.cameras.main.startFollow(kirby);

    goal = this.physics.add.sprite(400, 0, "goal")

    //Enable cursor keys for kirby movement
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    //Kirby Freeze
    kirby.setVelocityX(0);

    //Kirby MOVE
    if (cursors.left.isDown){
        kirby.setVelocityX(-150);
    } else if (cursors.right.isDown){
        kirby.setVelocityX(150);
    }

    if (cursors.up.isDown){
        if (kirby.body.touching.down){
            kirby.setVelocityY(-400);
        }
    } 

    //Adjust camera according to kirby's height
    this.cameras.main.scrollY = kirby.y - this.cameras.main.height/2;

    //Check if the Kirby reaches the goal
    if (Phaser.Geom.Intersects.RectangleToRectangle(kirby.getBounds(), goal.getBounds())){
        winGame();
    }
}

function winGame() {
    console.log("YOU FINALLY WON!");
}

/*
let gameScene = new Phaser.Scene('Game')

// Game configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    {
        preload: preload,
        create: create,
        update: update
    },
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
    let kirby = this.physics.add.sprite(this.sys.this.config.width/2, this.sys.this.config.height/2, "kirby")
    kirby.setGravityY(100);

    let groundX = this.sys.this.config.width/2;
    let groundY = this.sys.this.config.height * .95;
    let ground = this.physics.add.sprite(groundX, groundY, "ground");
    ground.displayWidth = this.sys.this.config.width;

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
