const viewWidth = 500;
const viewHeight = 500;
const mapWidth = 3000;
let mapHeight = 3000;
const scaleRatioX = 0.5; //viewWidth / mapWidth;
const scaleRatioY = 0.5; //viewHeight / mapHeight;
var currentLevel = 1; //note current level
var score = 0; //note current score

let popup;
let restartButton;
let exitButton;
var allowMove;

let islandsGroup; //group of islands

//For positioning the goal
var topIslandX;
var topIslandY;
var topIslandWidth;

var levelLabelGroup;

var config = {
    type: Phaser.AUTO,
    
    scale: {
        //mode: Phaser.Scale.FIT,
        parent: "canvas",
        width: viewWidth,
        height: viewHeight,
    },
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 1000 }, // Set the gravity value
            debug: false // Set to true to show physics bodies
        }
    },
    scene: {
        key: 'scene',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    //Preload sprites
    this.load.image("kirby", "static/assets/kirby.png");   // 689x685
    this.load.image("ground", "static/assets/ground.png"); // 333x32
    this.load.image("goal", "static/assets/goal.png");     // 512x512
    this.load.image("lava", "static/assets/lava.png");     // 487x103
}

function create() {

    hidePopup();
    allowMove = true;

    //Create lava floor
    lava = this.add.sprite(mapWidth/2, mapHeight, "lava"); //this.sys.game.config.height-200, "lava");
    lava.setScale(10, 1);

    //Create islandsGroup
    islandsGroup = this.physics.add.staticGroup();

    //Create first floating island
    var firstIsland = islandsGroup.create(mapWidth/2, mapHeight-50, "ground");
    firstIsland.setSize(200, 42);
    firstIsland.displayWidth = 200;

    //Create floating islands
    const islands = generateIslands();
    islands.forEach((island) => {
        if(island.y > 137){
            createIsland(island.x, island.y, island.width, 32);
        }
    });

    //create goal
    console.log("topIslandX: " + topIslandX);
    console.log("topIslandWidth: " + topIslandWidth);
    console.log("Spawning Goal at " + (topIslandX + topIslandWidth/2 - 0.2 * 512));
    goal = this.physics.add.sprite(topIslandX + topIslandWidth/2 - 0.2*512, 0, "goal");
    //goal = this.physics.add.sprite(200, 0, "goal");
    goal.setScale(0.2,0.2);

    //Create kirby
    kirby = this.physics.add.sprite(mapWidth/2, mapHeight-200, "kirby");
    kirby.setScale(0.2,0.2);

    //Make bouncy kirby
    kirby.setBounce(0.2);

    //Laws of Physics
    //kirby.setCollideWorldBounds(true);

    //Enable cursor keys for kirby movement
    cursors = this.input.keyboard.createCursorKeys();

    //Let colliders
    this.physics.add.collider(kirby, islandsGroup);
    this.physics.add.collider(kirby, lava);

    this.physics.add.collider(goal, islandsGroup);
    this.physics.add.collider(goal, lava);

    //this.cameras.main.setOrigin(this.sys.game.config.width/2, 2700)
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.setViewport(0, 0, 500, 500);
    this.cameras.main.setZoom(Math.min(scaleRatioX, scaleRatioY));

    //Make camera focus kirby
    this.cameras.main.startFollow(kirby);

    //setScrollFactor is used to make the label position absolute
    //setOrigin to create label from top left of container
    scoreText = this.add.text(-175, -250, "Score", {
        fontSize: "48px",
        fill: "#FFFFFF",
        stroke: "#A117F2",
        strokeThickness: 3
    }).setScrollFactor(0);
    scoreText.setOrigin(0.5, 0);

    var scoreNumber = this.add.text(-175, -200, score, {
        fontSize: "48px",
        fill: "#FFA500",
        stroke: "#FF0000",
        strokeThickness: 4
    }).setScrollFactor(0);
    scoreNumber.setOrigin(0.5, 0);

    //setScrollFactor is used to make the label position absolute
    //setOrigin to create label from top left of container
    levelText = this.add.text(675, -250, "Level", {
        fontSize: "48px",
        fill: "#FFFFFF",
        stroke: "#A117F2",
        strokeThickness: 3
    }).setScrollFactor(0);
    levelText.setOrigin(0.5, 0);

    var levelNumber = this.add.text(675, -200, currentLevel, {
        fontSize: "48px",
        fill: "#FFA500",
        stroke: "#FF0000",
        strokeThickness: 4
    }).setScrollFactor(0);
    levelNumber.setOrigin(0.5, 0);

}

function update() {

    //Keep score label in same place
    //console.log(levelLabelGroup.x + " " + levelLabelGroup.y);
    //levelLabelGroup.setScrollFactor(0,0);

    //Kirby Freeze
    kirby.setVelocityX(0);

    //Kirby MOVE
    if (allowMove){
        if (cursors.left.isDown){
            kirby.setVelocityX(-400);
        } else if (cursors.right.isDown){
            kirby.setVelocityX(400);
        }

        if (cursors.up.isDown){
            if (kirby.body.touching.down){
                kirby.setVelocityY(-800);
            }
        } 
    }

    //Adjust camera and Level Label according to kirby's height
    this.cameras.main.scrollY = kirby.y - this.cameras.main.height/2;


    //Check if the Kirby reaches the goal
    if (Phaser.Geom.Intersects.RectangleToRectangle(kirby.getBounds(), goal.getBounds())){
        winGame();
    }

    if (Phaser.Geom.Intersects.RectangleToRectangle(kirby.getBounds(), lava.getBounds())){
        document.getElementById("score").innerHTML = score;
        submitScore(score);
        loseGame();
    }
}

function generateIslands() {
    var islands = [];

    var islandX;
    var islandY = mapHeight;
    let lastIslandX = mapWidth/2;
    let lastIslandY = mapHeight - 50;
    const maxGap = 500;
    const minGap = 200;
    var islandWidth;
    var lastIslandWidth = 150;

    while (islandY > 137){ //height of kirby
        //333x32

        islandWidth = Math.floor(Math.random() * 200) + 100; //Random width btwn 100 and 300
        var gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        var fiftyChance = (Math.random() < 0.5 ? -1 : 1);

        //keep islandX within map bounds
        islandX = lastIslandX + (fiftyChance * (lastIslandWidth + gap));

        if (islandX < 0){
            islandX = lastIslandX + (lastIslandWidth + gap);
        };

        if(islandX + islandWidth > mapWidth){
            islandX = lastIslandX - (lastIslandWidth + gap);
        };

        islandY = lastIslandY - Math.floor(Math.random() * 50 + 250);

        //push values to constructor
        islands.push({
            x: islandX,
            y: islandY,
            width: islandWidth,
            height: 32
        });

        topIslandX = lastIslandX;
        console.log("New Top islandX: " + topIslandX);
        //topIslandY = lastIslandY;
        topIslandWidth = lastIslandWidth;
        console.log("New Top islandWidth: " + topIslandWidth);

        //push the creation data of last island
        lastIslandX = islandX;
        lastIslandY = islandY;
        lastIslandWidth = islandWidth;
    }
    
    //topIslandX = lastIslandX;
    //topIslandY = lastIslandY;
    //topIslandWidth = lastIslandWidth;

    return islands;
}

function createIsland(x, y, width, height) {
    console.log("x: " + x + " y: " + y + " width: " + width + " height " + height);
    const island = islandsGroup.create(x, y, "ground");
    island.setSize(width, height);
    island.displayWidth = width;
}

function winGame() {
    console.log("YOU FINALLY WON!");
    currentLevel++;
    score = (currentLevel-1)*100;
    //levelText.setText("Score: ")
    console.log(currentLevel);
    if(currentLevel % 5 == 0){
        mapHeight *= currentLevel/5 + 1;
    } else {
        mapHeight = 3000;
    }
    game.scene.start('scene');
}

function loseGame() {
    //Defeat Screen Pop up
    console.log("You died. You suck!");

    //Reset Level
    currentLevel = 1;

    //mapHeight = 3000;
    console.log(currentLevel);
    game.scene.start('scene');
    allowMove = false;
    showPopup();

}

function showPopup(){
    console.log("showPopup calling")
    document.querySelector('.popup').style.display = 'block';
    console.log("showPopup called")
}

function hidePopup() {
    document.querySelector('.popup').style.display = 'none';
}

// Submits score to flask
function submitScore(value) {
    fetch('/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ my_score: value })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);  // Print the response from the Flask route
    });
}