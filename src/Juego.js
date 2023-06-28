var player;
var platforms;
var score = 0;
var gameOver = false;
var cursors;
var triangle;
var circle;
var square;
var timedEvent;
var n;


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1600,
            height: 1200
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene:{preload: preload,create: create,update: update}
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('cielo', 'public/assets/images/Cielo.webp')
    this.load.image('ninja', 'public/assets/images/Ninja.png')
    this.load.image('ground', 'public/assets/images/platform.png')
}

function create (){
    gameOver = false;
    score = 0;

    timedEvent = this.time.addEvent({ 
        delay: 3000, 
        callback: onSecond, 
        callbackScope: this, 
        loop: true 
    });

    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'cielo').setScale(2);
    

    platforms = this.physics.add.staticGroup();

    circle = this.physics.add.group();
    triangle = this.physics.add.group();
    square = this.physics.add.group();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, "ninja").setScale(0.15);
    
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, circle);
    this.physics.add.collider(platforms, circle);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(player, circle, collectCircle, null, this);
    this.physics.add.overlap(platforms, circle, setGameOver, null, this);
    
}
function update(){
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    
    } else {
        player.setVelocityX(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function onSecond(){
    if(!gameOver){
        n = (Math.random() * (20 - 680)) + 680;
        console.log (n);

        const papa = this.add.circle(n, 50, 40, 0xff6699);
        this.physics.add.existing(papa);
        papa.body.setCircle(40);
        circle.add(papa);  
    }
}
function collectCircle(player, circle){
    circle.destroy();
}
function setGameOver(){
    gameOver = true;
}