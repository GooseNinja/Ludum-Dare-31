var menuState = {
  create: function() {

    this.music = game.add.audio('menu', 0);

    this.music.onDecoded.add(function() {
      this.music.fadeIn(5000, true);
      }, this);

    this.menuBG = game.add.sprite(0, 0, 'menu');
    this.playButton = game.add.button(game.world.centerX, 450, 'play_button', this.start, this);
    this.playButton.anchor.setTo(0.5, 0.5);

    this.upperHalfLogo = game.add.sprite(game.world.centerX, game.world.centerY, 'upperHalfLogo');
    this.upperHalfLogo.anchor.setTo(0.5, 1);

    game.add.tween(this.upperHalfLogo)
      .to({ y: 0 }, 500, Phaser.Easing.Linear.None, true, 500)
      .onComplete.add(this.showMenu, this);

    this.lowerHalfLogo = game.add.sprite(game.world.centerX, game.world.centerY, 'lowerHalfLogo');
    this.lowerHalfLogo.anchor.setTo(0.5, 0);

    game.add.tween(this.lowerHalfLogo)
      .to({ y: 540 }, 500, Phaser.Easing.Linear.None, true, 500)
      .start();
  },
  start: function() {
    this.music.stop();
    game.state.start('play');
  },
  showMenu: function() {
  }
};