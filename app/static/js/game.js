var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 2000,
    parent: "canvas",
    physics: {
        default: 'arcade',
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

//var kirby;
//var ground;

function preload() {
    //Preload sprites
    this.load.image("kirby", "static/assets/kirby.png");
    this.load.image("ground", "static/assets/ground.png");
    this.load.image("goal", "static/assets/goal.png");
}

function create() {
    //Create kirby
    kirby = this.physics.add.sprite(600, 1900, "kirby");
    kirby.setScale(0.2,0.2);

    //Make bouncy kirby
    kirby.setBounce(0.2);

    //Laws of Physics
    kirby.setCollideWorldBounds(true);

    //Enable cursor keys for kirby movement
    cursors = this.input.keyboard.createCursorKeys();

    //Create floating islands
    islands = this.physics.add.staticGroup();
    islands.create(700, 2000, "ground");
    islands.create(1300, 1800, "ground");
    islands.create(800, 1400, "ground");

    //Let kirby crash into the wall
    this.physics.add.collider(kirby, islands);

    //Make camera focus kirby
    this.cameras.main.startFollow(kirby);

    //create goal
    goal = this.physics.add.sprite(900,1000, "goal");
    goal.setScale(0.2,0.2);
    this.physics.add.collider(goal, islands);

}

function update() {

    //Kirby Freeze
    kirby.setVelocityX(0);

    //Kirby MOVE
    if (cursors.left.isDown){
        kirby.setVelocityX(-250);
    } else if (cursors.right.isDown){
        kirby.setVelocityX(250);
    }

    if (cursors.up.isDown){
        if (kirby.body.touching.down){
            kirby.setVelocityY(-1000);
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