var loadState = {
  preload: function() {
    var loadingLabel = game.add.text(game.world.centerX, 150, 'Loading...', { font: '30px Arial', fill: '#fff' });
    loadingLabel.anchor.setTo(0.5, 0.5);

    var progressBar = game.add.sprite(game.world.centerX, game.world.centerY-25, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    // Load Assets Here
    game.load.image('player', 'assets/player.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('pixel', 'assets/pixel.png');
    game.load.image('pPixel1', 'assets/pPixel-1.png');
    game.load.image('pPixel2', 'assets/pPixel-2.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('play_button', 'assets/play_button.png');
    game.load.image('menu', 'assets/menu_bg.png');
    game.load.image('gameOver', 'assets/game_over.png');
    game.load.image('replay', 'assets/replay.png');
    game.load.image('mine', 'assets/mine.png');
    game.load.image('minePixel', 'assets/minePixel.png');

    game.load.audio('menu', ['assets/menu.ogg', 'assets/menu.wav']);
    game.load.audio('shot', ['assets/shot.ogg', 'assets/shot.wav']);
    game.load.audio('death', ['assets/death.ogg', 'assets/death.wav']);
    game.load.audio('explode', ['assets/explode.ogg', 'assets/explode.wav']);
    game.load.audio('gameOver', ['assets/game-over.ogg', 'assets/game-over.wav']);
    game.load.audio('dead-enemy', ['assets/dead-enemy.ogg', 'assets/dead-enemy.wav']);
    game.load.audio('game_music', ['assets/game-music.ogg', 'assets/game-music.wav']);
  },
  create: function() {
    game.state.start('menu');
  }
};