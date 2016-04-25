Sk8Skull = {
    pixel: { actualscale: 1, scale: 1,  canvas: null, context: null, width: 0, height: 0 },
    scaleBind: function() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(Sk8Skull.scaleGame, this, 0 , 1);
        this.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(Sk8Skull.scaleGame, this, 0 , 2);
        this.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(Sk8Skull.scaleGame, this, 0 , 3);
        this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR).onDown.add(Sk8Skull.scaleGame, this, 0 , 4);
        this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE).onDown.add(Sk8Skull.scaleGame, this, 0 , 5);
        this.game.input.keyboard.addKey(Phaser.Keyboard.SIX).onDown.add(Sk8Skull.scaleGame, this, 0 , 6);
        this.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN).onDown.add(Sk8Skull.scaleGame, this, 0 , 7);
        this.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT).onDown.add(Sk8Skull.scaleGame, this, 0 , 8);
        this.game.input.keyboard.addKey(Phaser.Keyboard.NINE).onDown.add(Sk8Skull.scaleGame, this, 0 , 9);
        
        this.game.input.keyboard.addKey(Phaser.Keyboard.EQUALS).onDown.add(Sk8Skull.scaleGame, this, 0 , '+');
        this.game.input.keyboard.addKey(Phaser.Keyboard.UNDERSCORE).onDown.add(Sk8Skull.scaleGame, this, 0 , '-');

        this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_ADD).onDown.add(Sk8Skull.scaleGame, this, 0 , '+');
        this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_SUBTRACT).onDown.add(Sk8Skull.scaleGame, this, 0 , '-');
    },
    scaleGame: function(e,ammount) {
        if (e.type == 'mousewheel') {
            Sk8Skull.pixel.scale = (e.wheelDelta >= 0 ? Sk8Skull.pixel.scale + 1 : Sk8Skull.pixel.scale - 1);
        }
        if (ammount) {
            if (typeof ammount == 'number') Sk8Skull.pixel.scale = ammount;
            else if (ammount == '+') Sk8Skull.pixel.scale++;
            else if (ammount == '-') Sk8Skull.pixel.scale--;
        }
        if (e.distance) {
            var normalizedDistance = Math.floor(e.distance/10);
            Sk8Skull.pixel.scale = Sk8Skull.pixel.actualscale + (e.additionalEvent == 'pinchout' ? normalizedDistance : -normalizedDistance ) || 1;
        }
        if (window.innerWidth < this.game.width * Sk8Skull.pixel.scale || window.innerHeight < this.game.height * Sk8Skull.pixel.scale) {
            Sk8Skull.pixel.scale = Math.floor(Math.min(window.innerWidth, window.innerHeight)/this.game.width);
        }
        if (Sk8Skull.pixel.scale < 1) {
            Sk8Skull.pixel.scale = 1;
        }
        Sk8Skull.pixel.width = Sk8Skull.pixel.canvas.width = this.game.width * Sk8Skull.pixel.scale;
        Sk8Skull.pixel.height = Sk8Skull.pixel.canvas.height = this.game.height * Sk8Skull.pixel.scale;
        Phaser.Canvas.setSmoothingEnabled(Sk8Skull.pixel.context, false);
    },
    scaleDraw: function(){
        Sk8Skull.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, Sk8Skull.pixel.width, Sk8Skull.pixel.height);
    }
};

Sk8Skull.LoadingBar = function(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.bar = game.add.sprite(32, 35, game.add.bitmapData(game.width,2).fill(0, 0, 0, 0));
    this.add(this.bar);
};

Sk8Skull.LoadingBar.prototype = Object.create(Phaser.Group.prototype);
Sk8Skull.LoadingBar.prototype.constructor = Sk8Skull.LoadingBar;

Sk8Skull.Boot = function (game) {

};

Sk8Skull.Boot.prototype = {

    init: function () {
        //  Hide the un-scaled game canvas
        this.game.canvas.style['display'] = 'none';

        //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
        Sk8Skull.pixel.canvas = Phaser.Canvas.create(0,0);

        // Set canvas size to our initial scale and cache the width/height to avoid looking it up every render
        Sk8Skull.pixel.width = Sk8Skull.pixel.canvas.width = this.game.width * Sk8Skull.pixel.scale;
        Sk8Skull.pixel.height = Sk8Skull.pixel.canvas.height = this.game.height * Sk8Skull.pixel.scale;

        
        //  Store a reference to the Canvas Context
        Sk8Skull.pixel.context = Sk8Skull.pixel.canvas.getContext('2d');

        //  Add the scaled canvas to the DOM
        Phaser.Canvas.addToDOM(Sk8Skull.pixel.canvas);
        Sk8Skull.pixel.canvas.style['visibility'] = 'hidden';

        //  Disable smoothing on the scaled canvas
        Phaser.Canvas.setSmoothingEnabled(Sk8Skull.pixel.context, false);

    },

    create: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        // this.stage.disableVisibilityChange = true;

        //  So now let's start the real preloader going
        this.state.start('Preloader');
    },

    render: function() {
        Sk8Skull.scaleDraw.call(this);
    }

};
