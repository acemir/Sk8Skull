Sk8Skull.Game = function(game) {
        // SET MOUSE AND TOUCH CONTROLS
        var _this = this;
        var hammertime = new Hammer(document.body);

        hammertime.get('pinch').set({ enable: true });

        hammertime.on('tap', function(e){ _this.btnDown() });
        hammertime.on('pinchstart pinchend', function(e){ Sk8Skull.pixel.actualscale = Sk8Skull.pixel.scale });
        hammertime.on('pinchmove', function(e){ Sk8Skull.scaleGame.apply(_this, [e]) });

        document.body.addEventListener('mousewheel', function(e){ Sk8Skull.scaleGame.apply(_this, [e]) } );
        window.addEventListener('resize', function(e){ !!_this.game && Sk8Skull.scaleGame.apply(_this, [e]) } );
};

Sk8Skull.Game.prototype = {

    create: function() {

        this.game.started = false;

        // BACKGROUND
        this.game.stage.backgroundColor = '#4d533c';
        this.world.setBounds( 0, 0, this.game.width, this.game.height + 12 );

        this.bg_0 = this.game.add.tileSprite(0, 0, 80, 64, 'bg_0');
        this.bg_0.scrollAmmount = -8;
        this.bg_0.autoScroll(-8, 0);
        this.bg_0.fixedToCamera = true;

        this.bg_1 = this.game.add.tileSprite(0, 0, 80, 64, 'bg_1');
        this.bg_1.autoScroll(-16, 0);
        this.bg_1.fixedToCamera = true;

        this.bg_2 = this.game.add.tileSprite(0, 0, 80, 64, 'bg_2');
        this.bg_2.autoScroll(-32, 0);
        this.bg_2.fixedToCamera = true;

        // TITLES
        this.title_0_text = this.add.sprite(0, 0, 'title_0');
        this.title_0_text.fixedToCamera = true;
        this.title_0 = this.game.add.group();
        this.title_0.add(this.title_0_text);
        this.title_0.y = -34;
        this.add.tween(this.title_0).to({y: 2}, 600, Phaser.Easing.Quadratic.InOut, true);

        this.title_1_text = this.add.sprite(0, 0, 'title_1');
        this.title_1_text.fixedToCamera = true;
        this.title_1 = this.game.add.group();
        this.title_1.add(this.title_1_text);
        this.title_1.x = 27;
        this.title_1.y = 64;
        this.add.tween(this.title_1).to({y: 32}, 600, Phaser.Easing.Quadratic.InOut, true);

        // SCORE
        this.radical = 0;
        this.radicalText = this.game.add.bitmapText(this.game.width/2, 2, 'carrier_command', '' + this.radical, 10);
        this.radicalText.tint = 0xc4cfa1;
        this.radicalText.anchor.x = 0.5;
        this.radicalText.fixedToCamera = true;
        
        this.radicalGroup = this.game.add.group();
        this.radicalGroup.add(this.radicalText);
        this.radicalGroup.y = -32;

        Sk8Skull.bestRadical = localStorage.getItem('Sk8Skull') || 0;
        localStorage.setItem('Sk8Skull',Sk8Skull.bestRadical);

        this.bestText = this.game.add.bitmapText(this.game.width - 2, this.game.height - 8, 'carrier_command', 'HI:' + localStorage.getItem('Sk8Skull') || Sk8Skull.bestRadical, 5);
        this.bestText.tint = 0x1f1f1f;
        this.bestText.anchor.x = 1;
        this.bestText.fixedToCamera = true;

        this.bestGroup = this.game.add.group();
        this.bestGroup.add(this.bestText);
        this.bestGroup.y = 8;

        this.add.tween(this.bestGroup).to({y: 0}, 300, Phaser.Easing.Quadratic.InOut, true, 300);


        // PHYSICS
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // PLATFORMS
        this.platformsCreate();

        // OBSTACLES
        this.spikesCreate();

        // PLAYER
        this.playerCreate();

        // CONTROLS
        this.controlsCreate();

        // TRACKING
        this.cameraYMax = 31;
        this.platformXMax = 0;
        this.spikeXMax = 0;

        // MENU JUMP
        this.menuLoop = this.game.time.events.add(Phaser.Timer.SECOND, function(){
            if (!this.game.started) {
                this.player.body.velocity.y = -90;
                this.player.animations.play('kickflip');
                Sk8Skull.JUMP.play();
            }
        }, this);

        Sk8Skull.scaleBind.call(this);

        Sk8Skull.MUSIC.play();
    },

    update: function() {

        this.player.x = Math.round(this.player.x);

        this.world.setBounds( 0, 0, this.game.width + this.player.xChange, this.game.height + 12 );

        this.cameraYMax = Math.max(this.cameraYMax, this.player.y);
        this.game.camera.focusOnXY(this.player.x + this.game.width, this.cameraYMax);

        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.spikes, this.isJumping, null, this);

        this.player.jumping = !this.player.body.touching.down;
        this.player.xChange = Math.max( this.player.xChange, Math.abs( this.player.x - this.player.xOrig ) );

        this.spikes.forEachAlive( function( elem ) {
          this.spikeXMax = Math.max( this.spikeXMax, elem.x );
          if( elem.x + elem.width < this.camera.x ) {
            elem.kill();
            if (!this.player.dead) {
                this.radical += 1;
                this.radicalText.text = this.radical;
                localStorage.setItem('Sk8Skull', Math.max(Sk8Skull.bestRadical,this.radical));
                if (this.radical % 4 === 0 && this.player.body.velocity.x < 80) {
                    this.player.body.velocity.x += 1;
                }
            }
            this.spikesCreateOne( this.spikeXMax + this.game.rnd.integerInRange(56,64*4) , this.game.world.height - 13, (this.radical > 24 - 2) ? 21 : (this.radical > 18 - 2) ? 19 : (this.radical > 12 - 2) ? 17 :(this.radical > 6 - 2 ) ? 15 : 11);
          }
        }, this );


        this.platforms.forEachAlive( function( elem ) {
          this.platformXMax = Math.max( this.platformXMax, elem.x );
          if( elem.x + elem.width < this.camera.x ) {
            elem.kill();
            this.platformsCreateOne( this.platformXMax + 16 , this.game.world.height - 12);
          }
        }, this );

        // if the hero falls below the camera view, gameover
        if( this.player.y > this.game.world.height) {
            this.player.dead = true;
            this.player.body.velocity = 0;
        }

        if (this.player.dead) {
            this.player.frame = 13;
            if (this.player.body.velocity.x < 1) {
                this.player.body.velocity.x = 0;
                return;
            }
            this.player.body.velocity.x += -(this.player.body.velocity.x)*0.1;
        }
    },

    render: function() {
        // this.game.debug.body(this.player);
        // this.spikes.forEachAlive(function(member){
        //     this.game.debug.body(member);
        // },this);
        Sk8Skull.scaleDraw.call(this);
    },

    platformsCreate: function() {
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;
        this.platforms.createMultiple( 5, 'ground' );

        this.platformsCreateOne( 4, this.game.world.height - 24 );

        for( var i = 1; i < 5; i++ ) {
            this.platformsCreateOne( 16*i, this.game.world.height - 12 );
        }
    },

    platformsCreateOne: function( x, y ) {
        // this is a helper function since writing all of this out can get verbose elsewhere
        var platform = this.platforms.getFirstDead();
        platform.reset( x, y );
        platform.body.immovable = true;
        platform.body.height = 8;
        platform.body.offset.y = 4;
        return platform;
    },
    
    spikesCreate: function() {
        this.spikes = this.game.add.group();
        this.spikes.enableBody = true;

        // this.spikes.createMultiple( 3, 'spike' );

        for( var i = 1; i < 4; i++ ) {
            this.spikes.add(this.game.add.tileSprite((this.game.width + 8) * (i+1), this.game.world.height - 13, 11, 9, 'spike'));
            // this.spikesCreateOne( (this.game.width + 8) * (i+1), this.game.world.height - 13 );
        }
    },

    spikesCreateOne: function( x, y, width ) {
        // this is a helper function since writing all of this out can get verbose elsewhere
        var spike = this.spikes.getFirstDead();
        spike.reset( x, y );
        spike.width = width || 11;
        spike.body.width = width || 11;
        spike.body.enable = true;
        spike.body.immovable = true;
        return spike;
    },

    playerCreate: function() {
        this.player = this.game.add.sprite(0, this.game.world.height - 44, 'skull');

        // track where the hero started and how much the distance has changed from that point
        this.player.xOrig = this.player.x;
        this.player.xChange = 0;

        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 280;
        // this.player.body.collideWorldBounds = true;
        this.player.body.width = 13;
        this.player.body.height = 6;
        this.player.body.offset.x = 6;
        this.player.body.offset.y = 18;
        this.player.jumping = false;
        this.player.dead = false;
        this.player.radical = 0;

        this.player.animations.add('run', [2, 3, 0, 1], 10, true).onComplete.add(this.playerIdle, this);
        this.player.animations.add('ollie', [4, 5, 6, 10, 11, 12], 10, false).onComplete.add(this.playerIdle, this);
        this.player.animations.add('nollie', [13, 14, 6, 10, 11, 12], 10, false).onComplete.add(this.playerIdle, this);
        this.player.animations.add('kickflip', [4, 5, 7, 8, 9, 11], 10, false).onComplete.add(this.playerIdle, this);
    },

    playerIdle: function() {
        if (this.player.body.velocity.x && !this.player.dead) this.player.animations.play('run');
        if (!this.game.started) this.player.frame = 0;
    },

    controlsCreate: function() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.btnDown, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(this.btnDown, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.btnDown, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.M).onDown.add(this.noMusic, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.N).onDown.add(this.noAudio, this);

        this.game.onPause.add(this.gamePause, this);
        this.game.onResume.add(this.gameResume, this);
    },

    btnDown: function() {
        if (!this.game) return;
        if (!this.game.started) {
            this.game.started = true;
            this.add.tween(this.title_0).to({y: -86}, 600, Phaser.Easing.Quadratic.InOut, true);
            this.add.tween(this.title_1).to({y: -32}, 600, Phaser.Easing.Quadratic.InOut, true);
            this.add.tween(this.radicalGroup).to({y: 0}, 600, Phaser.Easing.Quadratic.InOut, true, 300);
            this.player.body.velocity.x = 75;
        }

        if (!this.player.dead && this.player.body.touching.down) {
            var stunt = this.game.rnd.pick(['ollie', 'nollie', 'kickflip']);
            this.player.body.velocity.y = -90;
            this.player.animations.play(stunt);
            Sk8Skull.JUMP.play();
        }

        if (this.player.dead && this.player.body.velocity.x == 0) {
            this.state.start('Game');
        }
    },

    noMusic: function() {
        Sk8Skull.MUSIC.mute = !Sk8Skull.MUSIC.mute;
    },

    noAudio: function() {
        Sk8Skull.JUMP.mute = !Sk8Skull.JUMP.mute;
        Sk8Skull.DIE.mute = !Sk8Skull.DIE.mute;
    },

    gamePause: function() {
        Sk8Skull.MUSIC.isPlaying && Sk8Skull.MUSIC.pause();
    },

    gameResume: function() {
        !Sk8Skull.MUSIC.mute && Sk8Skull.MUSIC.resume();
    },

    isJumping: function(player, spike) {
        if (!player.jumping) {
            spike.body.enable = false;
            player.dead = true;
            Sk8Skull.DIE.play();
            Sk8Skull.MUSIC.stop();
        }
    }
}
