Sk8Skull.Preloader = function(game) {
    this.ready = false;
};

Sk8Skull.Preloader.prototype = {

    preload: function() {
        this.load.image('bg_0', 'images/bg_0.png');
        this.load.image('bg_1', 'images/bg_1.png');
        this.load.image('bg_2', 'images/bg_2.png');
        this.load.image('title_0', 'images/title_0.png');
        this.load.image('title_1', 'images/title_1.png');
        this.load.image('ground', 'images/ground.png');
        this.load.spritesheet('skull', 'images/skull.png', 25, 25);
    },

    create: function() {
        this.state.start('Game');
    },

    render: function() {
        Sk8Skull.scaleDraw.call(this);
    }

};
