// (function () {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { 
                    preload: preload, 
                    create: create, 
                    update: update 
                });

    var player,
        platforms,
        score       = 0,
        scoreText,
        cursors,
        map,
        layer,
        level_bg,
        stars,
        heart,
        music,
        coins,
        lives       = 3,
        livesText,
        level       = 1,
        button_start_game,
        intro_sec   = 2,
        isGameStarted = false,
        coins_count = 0,
        youLoseText = "Вы проиграли",
        isFly       = true;


        var pictureA;
        var pictureB;
        var timer;
        var current = 3;


    function preload() {

        game.load.image('star',             'assets/res/star.png'); // WHY i need this???

       // game.load.image('death',             'assets/res/death.png');


       

        game.load.image('heart',             'assets/res/heart.png');



       // game.load.spritesheet('dude',       'assets/res/baddie.png', 32, 32);

        game.load.tilemap('level_1',        'assets/res/test_level_1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('dg_features32',    'assets/res/dg_features32.gif');

        //game.load.spritesheet('coin',       'assets/res/coin.png', 44, 40);
        game.load.spritesheet('coin',       'assets/res/spinning_coin_gold_min.png', 28, 28);

        game.load.image('menu_bg',          'assets/res/menu_bg_123.png');
        game.load.image('level_bg',          'assets/res/level_bg.png');


        game.load.spritesheet('start_button', 'assets/res/start_button.png',  120, 60);
       // game.load.image('button_start_game', 'assets/res/button_start_game.png');

    
    //   game.load.spritesheet('dude',        "assets/res/girl.png", 32, 32);

      // опасный
      game.load.spritesheet('dude',        "assets/res/ersh.png", 32, 32);
     // game.load.spritesheet('dude',        "assets/res/ersh_2.png", 32, 32);


     // intro
     game.load.image('intro_1',          'assets/res/intro_1.png');
     game.load.image('intro_2',          'assets/res/intro_2.png');
     game.load.image('intro_3',          'assets/res/intro_3.png');

     game.load.audio('boden', ['assets/sounds/theme.mp3', 'assets/sounds/theme.ogg']);



    }



    function load_menu () {

      
        game.stage.backgroundColor = '#BCD6B4';

        menu_bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'menu_bg');
        menu_bg.fixedToCamera = true;

        button = game.add.button(game.world.width / 2, game.world.height * 0.63, 'start_button', actionOnClick);
        //button.fixedToCamera = true;

        button.scale.setTo(1.5,1.5);

        timer.destroy();

    }


    function actionOnClick() {
        menu_bg.destroy();
        button.destroy();

        isGameStarted = true;

        lives = 3;
        score = 0;

        load_level ();

    }



    function load_level () {

        isGameStarted = true;

        switch (level) {

            case 1 : 

                game.physics.startSystem(Phaser.Physics.ARCADE);

                level_bg =  game.add.sprite(0, 0, 'level_bg');
                level_bg.fixedToCamera = true;


                player = game.add.sprite(50, game.world.height - 40, 'dude');

                game.physics.arcade.enable(player);


                player.body.gravity.y = 600;
                player.body.collideWorldBounds = true;

             // для напряденного ержа   
                player.animations.add( 'left',  [2,3], 10, true );
                player.animations.add( 'right', [0,4], 10, true );

                // для бутылки воды
             //   player.animations.add( 'left',  [0,1], 10, true );
              //  player.animations.add( 'right', [3,4], 10, true );


              // булочка
              // player.animations.add( 'left',  [0,1], 10, true );
              // player.animations.add( 'right', [3,4], 10, true );



                player.anchor.setTo(0.5 ,0.5);

                game.camera.follow(player);

                cursors = game.input.keyboard.createCursorKeys();

                map = game.add.tilemap('level_1');

                map.addTilesetImage('dg_features32');
                map.addTilesetImage('star');


                map.setCollisionBetween(1, 12);

                // 28 it's id of tile death
                map.setTileIndexCallback(55, death, this);

                // WTF?! This will set the map location 2, 0 to call the function
                map.setTileLocationCallback(0, 0, 1, 1, death, this);


                //  Here we create our coins group
                coins = game.add.group();
                coins.enableBody = true;

                map.createFromObjects('Object Layer 1', 13, 'coin', 0, true, false, coins);

                coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
                coins.callAll('animations.play', 'animations', 'spin');


                game.physics.arcade.enable(coins);


                coins_count = coins.length;


                layer = map.createLayer('Tiled layers 1');

                layer.resizeWorld();
                //  layer.debug = true;


                //  The score
                scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#ED1A28' });
                scoreText.fixedToCamera = true;

                for(var i = 0; i < lives; i++ ) {
                    heart = game.add.sprite(game.world.width/2 - 55 *  (i - 1), 16, 'heart');
                    heart.fixedToCamera = true;
                }

             //   livesText = game.add.text(game.world.width/2, 16, 'Lives: ' + lives , { fontSize: '32px', fill: '#FFFFFF' });
              //  livesText.fixedToCamera = true;


                game.time.events.add(Phaser.Timer.SECOND *  10, changeGravity, this);

            break;
            case 2:

                console.log("level 2");

            break;
            case 3:

            break;
        }
            
    }


    function intro() {
        // @TODO: animate scene

            pictureA = game.add.sprite(game.world.centerX, game.world.centerY, 'intro_1');
            pictureA.anchor.setTo(0.5, 0.5);
           // pictureA.scale.setTo(1, 1);

            pictureB = game.add.sprite(game.world.centerX, game.world.centerY, 'intro_2');
            pictureB.anchor.setTo(0.5, 0.5);
          //  pictureB.scale.setTo(2, 2);
            pictureB.alpha = 0;

            //  Create our Timer
            timer = game.time.create(false);

            //  Set a TimerEvent to occur after 3 seconds
            timer.add(3000, fadePictures, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            timer.start();

        }

        function fadePictures() {

            //  Cross-fade the two pictures
            var tween;

            if (pictureA.alpha === 1)
            {
                tween = game.add.tween(pictureA).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                game.add.tween(pictureB).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
            }
            else
            {
                game.add.tween(pictureA).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
                tween = game.add.tween(pictureB).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            }

            //  When the cross-fade is complete we swap the image being shown by the now hidden picture
            tween.onComplete.add(changePicture, this);

        }

        function changePicture () {

            if (pictureA.alpha === 0 && ( current == 1 || current == 3) )
            {
                pictureA.loadTexture('intro_' + current);
            }
            else if(pictureB.alpha === 0 && current == 2)
            {
                pictureB.loadTexture('intro_' + current);
            }

            current++;

            if( current == 5) {
                game.time.events.add(Phaser.Timer.SECOND * 3,  load_menu ,this);

                
            }

    

            //  And set a new TimerEvent to occur after 3 seconds
            timer.add(3000, fadePictures, this);

        }




   // }



    function create () {

        music = game.add.audio('boden');
        music.play();

        intro();

     //   game.time.events.add(Phaser.Timer.SECOND * intro_sec,  load_menu ,this);

    }

    function update () {


        if (isGameStarted !== false) {

            game.physics.arcade.collide(player, layer, collidePlayerWithWalls,  null, this);
            game.physics.arcade.collide(coins,  layer, collideCoinsWithWalls,   null, this);
            game.physics.arcade.overlap(player, coins, collectCoin,             null, this);


            // stop player when not pressed key
            player.body.velocity.x = 0;

            if(cursors.left.isDown && !isFly) {
                player.body.velocity.x = -150;
                player.animations.play('left');
            } 
            else if (cursors.right.isDown && !isFly) {
                player.body.velocity.x = 150;
                player.animations.play('right');
            }
            else if(cursors.up.isDown) {

                if ( !isFly ) {
                    isFly = true;
                }
                if (player.body.gravity.y > 0 ) {
                    player.body.gravity.y *= -1;
                    player.scale.y *= -1;

                    coins.forEach( function (L) {
                        L.body.gravity.y = -600;
                        L.body.bounce.y = 0.2;
                    })
                    
                }

            } else if(cursors.down.isDown) {

                if ( !isFly ) {
                    isFly = true;
                }
                if (player.body.gravity.y < 0 ) {
                    player.body.gravity.y *= -1;
                    player.scale.y *= -1;   

                    coins.forEach(function(L){
                        L.body.gravity.y = 600;
                        L.body.bounce.y = 0.2;
                    })
                }

            } else {
                player.animations.stop();
                player.frame = 1;
              //  player.frame = 2;
            }
        }

        
    }

    function changeGravity () {
        coins.forEach( function (L) {
            if (Math.random() > 0.5 ) {
                if (Math.random() > 0.5 ) { 
                    L.body.velocity.x = -150;
                } else {
                    L.body.velocity.x = 150;
                }
            } else {
                L.body.gravity.y *= -1;
            }
           
        })
    }

    function collidePlayerWithWalls () {

        if( isFly ) {
            isFly = false;
        } 
    }

    function collideCoinsWithWalls() {
    //    console.warn('collideCoinsWithWalls');
    }


    function death (sprite) {

        if(sprite != player) {
            return;
        }

        isGameStarted = false;

        console.warn('You are dead!');
        lives -= 1;
       // livesText.text = "Lives: " + lives;

        // youLoseText = game.add.text(game.world.width / 2, game.world.height / 2, 'Вы проиграли!', { fontSize: '32px', fill: '#ED1A28' });
        // youLoseText.fixedToCamera = true;

        game.stage.backgroundColor = '#FFFFFF';  

        
        erase_all();

        if( lives <= 0 ) {
            game_over();
        } else {
            load_level();
        }

       

        // game.time.events.add(Phaser.Timer.SECOND * 5, function () {



        //     youLoseText.destroy();
       
        // }, this);


      
       

    }

    function erase_all () {

        player.kill();
        layer.destroy();
        //cursors.destroy();
        map.destroy();
        coins.destroy();
        scoreText.destroy();
      //  livesText.destroy();
        level_bg.kill();


      //  game.input.keyboard.clearCaptures();

    }

    function game_over () {

        console.warn('Game over');

        erase_all();

        load_menu ();

    }

    function collectCoin(player, coin) {

        coin.kill();
        
        score += 10;

        scoreText.text = "Score: " + score;

        coins_count -= 1;

         console.warn('Coins left: ' + coins_count);

        if ( coins_count <= 0 ) {
            level += 1;
            score += 100;
            erase_all();
            load_level();
        }
    }



// }());