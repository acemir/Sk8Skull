Sk8Skull.Game = function(game) {

};

Sk8Skull.Game.prototype = {

    create: function() {

        this.game.stage.backgroundColor = '#4d533c';

        //background
        this.bg_0 = this.game.add.tileSprite(0, 0, 80, 64, 'bg_0');
        this.bg_0.autoScroll(-8, 0);
        this.bg_0.fixedToCamera = true;

        //background
        this.bg_1 = this.game.add.tileSprite(0, 0, 80, 64, 'bg_1');
        this.bg_1.autoScroll(-16, 0);
        this.bg_1.fixedToCamera = true;

        this.bg_2 = this.game.add.tileSprite(0, 0, 80, 64, 'bg_2');
        this.bg_2.autoScroll(-32, 0);
        this.bg_2.fixedToCamera = true;

        this.title_0 = this.add.sprite(0, -32, 'title_0');
        this.add.tween(this.title_0).to({y: 2}, 600, Phaser.Easing.Quadratic.InOut, true);

        this.title_1 = this.add.sprite(64, 32, 'title_1');
        this.add.tween(this.title_1).to({x: 27}, 600, Phaser.Easing.Cubic.Out, true, 1200);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        this.ground = this.platforms.create(0, this.game.world.height - 8, 'ground');
        this.ground.body.immovable = true;

        var player = this.player = this.game.add.sprite(0, this.game.world.height - 25 - 8, 'skull');
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        this.animRUN = this.player.animations.add('run', [0, 1, 2, 3], 12, true);
        this.animOLLIE = this.player.animations.add('ollie', [4, 5, 6], 12, false);
        this.animKICK = this.player.animations.add('kickflip', [4, 5, 6, 7, 8, 9, 10], 12, false);

        this.animKICK.onComplete.add(function(){
            this.player.frame = 0;
        },this);

        this.animOLLIE.onComplete.add(function(){
            this.player.frame = 0;
        },this);

        //Apply controls
        var key_UP = this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.kickflip, this);
        var key_W = this.game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(this.kickflip, this);
        var key_SPACE = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.kickflip, this);
		document.body.addEventListener('touchstart', function(e){player.animations.play('kickflip')});
		document.body.addEventListener('mousedown', function(e){player.animations.play('kickflip')});

        this.kickflip();

        Sk8Skull.scaleBind.call(this);
    },

    update: function() {
        this.game.physics.arcade.collide(this.player, this.platforms);
    },

    render: function() {
        Sk8Skull.scaleDraw.call(this);
    },

    kickflip: function() {
    	this.player.animations.play('kickflip');
    }
};
