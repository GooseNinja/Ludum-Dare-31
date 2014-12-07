var playState = {
  create: function() {

    game.global.score = 0;

    this.game_music = game.add.audio('game_music', 0, true);
    this.shot = game.add.audio('shot', 0.3);
    this.enemyDead = game.add.audio('dead-enemy', 0.3);
    this.gameOverMusic = game.add.audio('gameOver', 0.3, true);
    this.death = game.add.audio('death', 0.3);
    this.explode = game.add.audio('explode', 0.3);

    this.game_music.onDecoded.add(function() {
      this.game_music.play();
      this.game_music.fadeTo(5000, 0.3);
      }, this);

    this.createWorld();
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    this.enemySpawn = [{x: 16, y: 16},
                       {x: 944, y: 16},
                       {x: 16, y: 524},
                       {x: 944, y: 524}];

    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.collideWorldBounds = true;

    this.player.anchor.setTo(0.5, 0.5);

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(40, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);

    this.mines = game.add.group();
    this.mines.enableBody = true;
    this.mines.createMultiple(3, 'mine');

    this.playerMines = 3;

    this.mineEmitter = game.add.emitter(0, 0, 100);
    this.mineEmitter.makeParticles('minePixel');
    this.mineEmitter.setXSpeed(-150, 150);
    this.mineEmitter.setYSpeed(-150, 150);
    this.mineEmitter.gravity = 0;

    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(100, 'enemy');

    this.emitter = game.add.emitter(0, 0, 100);
    this.emitter.makeParticles('pixel');
    this.emitter.setXSpeed(-150, 150);
    this.emitter.setYSpeed(-150, 150);
    this.emitter.gravity = 0;

    this.pEmitter1 = game.add.emitter(0, 0, 500);
    this.pEmitter1.makeParticles('pPixel1');
    this.pEmitter1.setXSpeed(-150, 150);
    this.pEmitter1.setYSpeed(-150, 150);
    this.pEmitter1.gravity = 0;

    this.pEmitter2 = game.add.emitter(0, 0, 500);
    this.pEmitter2.makeParticles('pPixel2');
    this.pEmitter2.setXSpeed(-150, 150);
    this.pEmitter2.setYSpeed(-150, 150);
    this.pEmitter2.gravity = 0;

    this.keys = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR,
                                       Phaser.Keyboard.W,
                                       Phaser.Keyboard.A,
                                       Phaser.Keyboard.S,
                                       Phaser.Keyboard.D]);

    this.scoreLabel = game.add.text(game.world.centerX, 30, 'Kills: 0', { font: '18px Arial', fill: '#2c3e50'});
    this.scoreLabel.anchor.setTo(0.5, 0.5);

    this.mineLabel = game.add.text(game.world.centerX, 510, 'Mines: ' + this.playerMines, { font: '18px Arial', fill: '#2c3e50'});
    this.mineLabel.anchor.setTo(0.5, 0.5);

    this.xAxis = true;
    this.bulletSpeed = 400;
    this.enemySpeed = 1;
    this.bulletTime = 0;
    this.nextEnemy = 0;
    this.mineDrop = 0;
  },
  update: function() {

      game.physics.arcade.collide(this.enemies, this.enemies);
      game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

      game.physics.arcade.overlap(this.pEmitter1, this.enemies, this.emitterKill, null, this);
      game.physics.arcade.overlap(this.pEmitter2, this.enemies, this.emitterKill, null, this);

      game.physics.arcade.overlap(this.mineEmitter, this.enemies, this.bulletHitEnemy, null, this);
      game.physics.arcade.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);
      this.enemies.forEachAlive(this.enemyAI, this);

      if (game.time.now >= this.mineDrop && this.mines.getFirstAlive()) {
        this.explode.play();
        var mine = this.mines.getFirstAlive();

        this.mineEmitter.x = mine.x;
        this.mineEmitter.y = mine.y;
        this.mineEmitter.start(true, 1000, null, 100);
        mine.kill();
      }

    if (this.player.alive) {

      this.movePlayer();

      if (this.nextEnemy < game.time.now) {
        var start = 4000, end = 1000, score = 5;
        var delay = Math.max(start - (start-end)* game.global.score/score, end);

        this.addEnemy();
        this.nextEnemy = game.time.now + delay;
      }
    }
  },
  addEnemy: function() {
    var enemy = this.enemies.getFirstDead();
    if (!enemy) {
      return;
    }

    enemy.anchor.setTo(0.5, 0.5);
    var spawn = Math.floor(Math.random() * (4-0)) + 0;
    enemy.reset(this.enemySpawn[spawn].x, this.enemySpawn[spawn].y);
    enemy.checkWorldBounds = true;
  },
  movePlayer: function() {

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.player.body.velocity.x = -200;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      this.player.body.velocity.x = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      this.player.body.velocity.y = -200;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      this.player.body.velocity.y = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.playerMines > 0) {
        this.dropMine();
    }

    if (game.input.activePointer.isDown) {
      this.fireBullet();
    }
  },
  startMenu: function() {

    this.gameOverMusic.stop();
    game.state.start('play');
  },
  createWorld: function() {

  },
  playerHitWall: function() {

  },
  fireBullet: function() {

    if (game.time.now > this.bulletTime) {

      this.bullet = this.bullets.getFirstExists(false);

      if (this.bullet) {
        this.shot.play();
        this.bullet.reset(this.player.body.x + 16, this.player.body.y + 16);
        this.bullet.lifespan = 2000;

        this.xRange = Math.abs(this.player.x) - Math.abs(game.input.x);
        this.yRange = Math.abs(this.player.y) - Math.abs(game.input.y);

        if (Math.abs(this.yRange) > Math.abs(this.xRange)) {
          if (this.yRange > 0) {
            this.bulletSpeed = -400;
          } else {
            this.bulletSpeed = 400;
          }
          this.xAxis = false;
        } else {
          if (this.xRange > 0) {
            this.bulletSpeed = -400;
          } else {
            this.bulletSpeed = 400;
          }
          this.xAxis = true;
        }

        if (this.xAxis) {
          this.bullet.body.velocity.x = this.bulletSpeed;
        } else {
          this.bullet.body.velocity.y = this.bulletSpeed;
        }

        this.bulletTime = game.time.now + 100;
      }
    }
  },
  enemyAI: function(enemy) {
    if (this.player.alive) {
      enemy.game.physics.arcade.moveToObject(enemy, this.player, 50 * ((game.global.score/30) + 1));
    } else {
      enemy.game.physics.arcade.moveToObject(enemy, this.player, 0);
    }
  },
  playerDie: function() {

    this.game_music.stop();
    this.gameOverMusic.play();
    this.gameOver = game.add.sprite(game.world.centerX, game.world.centerY, 'gameOver');
    this.replay = game.add.button(game.world.centerX, game.world.centerY + 75, 'replay', this.startMenu, this);

    if (game.global.score > localStorage.getItem('mostKills')) {
      localStorage.setItem('mostKills', game.global.score);
    }

    var text = 'Kills: ' + game.global.score + '\nMost Kills: ' + localStorage.getItem('mostKills');

    this.finalScoreLabel = game.add.text(game.world.centerX, game.world.centerY, text, { font: 'bold 28px Arial', fill: '#000', weight: 'bold'});
    this.finalScoreLabel.anchor.setTo(0.5, 0.5);

    this.gameOver.anchor.setTo(0.5, 0.5);
    this.replay.anchor.setTo(0.5, 0.5);
    this.death.play();
    this.player.kill();
    this.pEmitter1.x = this.player.x;
    this.pEmitter1.y = this.player.y;
    this.pEmitter2.x = this.player.x;
    this.pEmitter2.y = this.player.y;
    this.pEmitter1.start(true, 10000, null, 200);
    this.pEmitter2.start(true, 10000, null, 200);
  },
  emitterKill: function(bullet, enemy) {
    this.emitter.x = enemy.x;
    this.emitter.y = enemy.y;
    this.emitter.start(true, 500, null, 15);
    enemy.kill();
  },
  bulletHitEnemy: function(bullet, enemy) {
    game.global.score += 1;
    this.scoreLabel.text = 'Kills: ' + game.global.score;
    this.enemyDead.play();
    this.emitter.x = enemy.x;
    this.emitter.y = enemy.y;
    this.emitter.start(true, 500, null, 15);
    enemy.kill();
    bullet.kill();
  },
  dropMine: function() {
    var mine = this.mines.getFirstDead();
    if (!mine) {
      return;
    }

    if (!this.mines.getFirstAlive()) {
      this.playerMines -= 1;
      this.mineLabel.text = 'Mines: ' + this.playerMines;
      this.mineDrop = game.time.now + 3000;
      mine.anchor.setTo(0.5, 0.5);
      mine.reset(this.player.x, this.player.y);
    }

  }
};