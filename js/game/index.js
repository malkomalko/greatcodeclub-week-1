/*****************************************************************************/

//@code-update
function codeUpdate(source, methods){
  update()
}

//@asset-update
function assetUpdate(){}

/*****************************************************************************/

var game
  , platforms
  , player
  , controls
  , stars
  , scoreText
  , sprites = {}

var runSpeed = 250
  , fallSpeed = 500
  , jumpSpeed = 400
  , score = 0

/*****************************************************************************/

function createGame(width, height){
  game = new Phaser.Game(width, height, Phaser.AUTO, '', {
    preload: preload, create: create, update: update
  })
}

createGame(800, 600)

/*****************************************************************************/

function preload(){
  game.load.image('sky', 'assets/sky.png')
  game.load.image('ground', 'assets/platform.png')
  game.load.image('star', 'assets/star.png')
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48)
}

function create(){
  createBackground()
  createPlatforms()
  createPlayer()
  createStars()
  createText()
  createControls()
}

function createBackground(){
  game.add.sprite(0, 0, 'sky')
}

function createPlatforms(){
  platforms = game.add.group()

  var ground = platforms.create(0, game.world.height - 64, 'ground')
  ground.scale.setTo(2, 2)
  ground.body.immovable = true

  var ledge = platforms.create(400, 400, 'ground')
  ledge.body.immovable = true

  ledge = platforms.create(-150, 250, 'ground')
  ledge.body.immovable = true
}

function createPlayer(){
  player = game.add.sprite(32, game.world.height - 150, 'dude')

  player.body.bounce.y = 0.2
  player.body.gravity.y = fallSpeed
  player.body.collideWorldBounds = true

  player.animations.add('left', [0, 1, 2, 3], 10, true)
  player.animations.add('right', [5, 6, 7, 8], 10, true)
}

function createStars(){
  stars = game.add.group()

  for (var i = 0; i < 12; i++) {
    var star = stars.create(i * 70, 0, 'star')
    star.body.gravity.y = fallSpeed
    star.body.bounce.y = 0.7 + Math.random() * 0.2
  }
}

function createText(){
  scoreText = game.add.text(16, 16, 'Score: 0', {
    font: '32px arial',
    fill: '#000'
  })
}

function createControls(){
  cursors = game.input.keyboard.createCursorKeys()
  cursors.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
}

function update(){
  game.physics.collide(player, platforms)
  game.physics.collide(stars, platforms)
  game.physics.overlap(player, stars, collectStar, null, this)

  player.body.velocity.x = 0

  if (cursors.left.isDown) {
    player.body.velocity.x = -runSpeed
    player.animations.play('left')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = runSpeed
    player.animations.play('right')
  } else {
    player.animations.stop()
    player.frame = 4
  }

  if (cursors.spacebar.isDown && player.body.touching.down) {
    player.body.velocity.y = -jumpSpeed
  }
}

/*****************************************************************************/

function collectStar(player, star){
  star.kill()

  score += 10
  scoreText.content = 'Score: ' + score
}

/*****************************************************************************/