Sk8Skull.Game = function(game) {

};

Sk8Skull.Game.prototype = {

    create: function() {

        this.game.stage.backgroundColor = '#4d533c';
        this.game.world.setBounds(0, 0, 3200, this.game.height + 8);

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

        this.standn = this.platforms.create(0, this.game.world.height - 16, 'ground');
        this.standn.body.immovable = true;

        this.ground = this.add.tileSprite(0,this.game.height,this.game.world.width,8,'ground');
        this.platforms.add(this.ground);
        this.ground.body.immovable = true;

        //create the fleas
        this.generateMounds();

        var player = this.player = this.game.add.sprite(0, this.game.world.height - 25 - 16, 'skull');
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        this.animRUN = this.player.animations.add('run', [0, 1, 2, 3], 10, true);
        this.animOLLIE = this.player.animations.add('ollie', [4, 5, 6], 10, false);
        this.animKICK = this.player.animations.add('kickflip', [4, 5, 6, 7, 8, 9, 10], 10, false);

        this.animKICK.onComplete.add(function(){
            this.player.jumping = false;
            if (this.player.body.velocity.x) this.player.animations.play('run');
            else this.player.frame = 0;
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

        this.kickflip(false);

        Sk8Skull.scaleBind.call(this);
    },

    update: function() {
        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.mounds, this.isJumping, null, this);
        if (this.player.body.velocity.x) this.game.camera.focusOnXY(this.player.x + 33, this.player.y);
    },

    render: function() {
        Sk8Skull.scaleDraw.call(this);
    },

    kickflip: function(isUser) {
        this.player.jumping = true;
        if (isUser) this.player.body.velocity.x = 60;
        else this.player.body.velocity.x = 0;
    	this.player.animations.play('kickflip');
    },
    
    generateMounds: function() {
        this.mounds = this.game.add.group();
     
        //enable physics in them
        this.mounds.enableBody = true;
     
        //phaser's random number generator
        var numMounds = 25;
        var mound;
     
        for (var i = 0; i < numMounds; i++) {
          //add sprite within an area excluding the beginning and ending
          //  of the game world so items won't suddenly appear or disappear when wrapping
          var x = this.game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
          mound = this.mounds.create(x, this.game.world.height-12, 'spikes');
          mound.body.velocity.x = 0;
        }
     
    },

    isJumping: function(player, mound) {
        if (player.jumping) {
            player.body.velocity.x = 60
        } else {
            player.body.velocity.x = 0
        }
    }
}
