var bootState = {
  preload: function() {
    game.load.image('progressBar', 'assets/progressBar.png');
    game.load.image('upperHalfLogo', 'assets/upp_half_logo.png');
    game.load.image('lowerHalfLogo', 'assets/lower_half_logo.png');
  },
  create: function() {
    game.stage.backgroundColor = '#ececec';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('load');
  }
};