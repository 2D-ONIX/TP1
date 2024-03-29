var player;
var platforms;
var score = 0;
var gameOver = false;
var cursors;
var triangle;
var circle;
var circlemalo;
var square;
var ROJO;
var timedEvent;
var n;
var scoreText;
var timeLeft = 80;
var timeText;
var winText;

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
    scene: { preload: preload, create: create, update: update }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('cielo', 'public/assets/images/Cielo.webp');
    this.load.image('ninja', 'public/assets/images/Ninja.png');
    this.load.image('ground', 'public/assets/images/platform.png');
    this.load.image('ROJO', 'public/assets/images/ROJO.png');
}

function create() {
    gameOver = false;
    score = 0;
    timeLeft = 80;

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
    ROJO = this.physics.add.group();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, "ninja").setScale(0.15);

    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, circle);
    this.physics.add.collider(platforms, circle);
    this.physics.add.collider(player, ROJO);
    this.physics.add.collider(platforms, ROJO);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(player, circle, collectCircle, null, this);
    this.physics.add.overlap(player, ROJO, hitRojo, null, this);
    this.physics.add.overlap(player, circle, collectCircle, null, this);
    this.physics.add.collider(platforms, circle, removeCircle, null, this);
    this.physics.add.collider(platforms, ROJO, removeRojo, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    timeText = this.add.text(16, 50, 'Time left: 80', { fontSize: '32px', fill: '#000' });
    winText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '', { fontSize: '64px', fill: '#00ff00' });
    winText.setOrigin(0.5);
}

function update() {
    if (gameOver) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-400);

    } else if (cursors.right.isDown) {
        player.setVelocityX(400);

    } else {
        player.setVelocityX(0);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    this.physics.world.collide(ROJO, platforms, removeRojo, null, this);
}

function onSecond() {
    if (!gameOver) {
        var circleX = getRandomX();
        var rojoX = getRandomX();
        while (Math.abs(circleX - rojoX) < 100) {
            rojoX = getRandomX();
        }

        const circleObj = this.add.circle(circleX, 50, 40, 0xff6699);
        this.physics.add.existing(circleObj);
        circleObj.body.setCircle(40);
        circle.add(circleObj);

        const rojoObj = this.physics.add.sprite(rojoX, 50, 'ROJO');
        rojoObj.setVelocityY(100);
        ROJO.add(rojoObj);
    }

    timeLeft -= 1;
    timeText.setText('Time left: ' + timeLeft);

    if (timeLeft <= 0) {
        setGameOver();
    }
}

function removeCircle(platforms, circle) {
    circle.destroy();
}

function removeRojo(platforms, rojo) {
    rojo.destroy();
}

function collectCircle(player, circle) {
    circle.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);

    if (score >= 100) {
        winText.setText('You Win!');
        gameOver = true;
    }
}

function hitRojo(player, rojo) {
    rojo.destroy();
    score -= 10;
    scoreText.setText('Score: ' + score);
}

function setGameOver() {
    gameOver = true;
    winText.setText('Game Over');
}

function getRandomX() {
    return Math.random() * (800 - 80) + 80;
}



