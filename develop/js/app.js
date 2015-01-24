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
        stars,
        coins,
        lives       = 3,
        livesText,
        level       = 1,
        button_start_game,
        isGameStarted = false,
        coins_count = 0,
        isFly       = true;


    function preload() {

        game.load.image('star',             'assets/res/star.png'); // WHY i need this???

        game.load.spritesheet('dude',       'assets/res/dude.png', 32, 48);

        game.load.tilemap('level_1',        'assets/res/test_level_1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('dg_features32',    'assets/res/dg_features32.gif');

        game.load.spritesheet('coin',       'assets/res/coin.png', 44, 40);

       // game.load.image('menu_bg',          'assets/res/menu_bg.png');

        //game.load.spritesheet('button_start_game', 'assets/res/button_start_game.png', 193, 71);
        game.load.image('button_start_game', 'assets/res/button_start_game.png');

    }


    function load_menu () {

        game.stage.backgroundColor = '#BCD6B4';
     //   menu_bg = game.add.tileSprite(0, 0, 800, 600, 'menu_bg');

        // button = game.add.button(game.world.centerX - 95, 400, 'button_start_game', actionOnClick, this, 2, 1, 0);

        button = game.add.button(game.world.centerX / 2 , game.world.centerY, "button_start_game", function () {

           // menu_bg.destroy();
            button.destroy();
            isGameStarted = true;

            lives = 3;
            score = 0;

            load_level ();

        });

      

    }


    function load_level () {

        isGameStarted = true;

        switch (level) {

            case 1 : 

                game.physics.startSystem(Phaser.Physics.ARCADE);

                player = game.add.sprite(64, game.world.height - 70, 'dude');

                game.physics.arcade.enable(player);

                player.body.gravity.y = 600;
                player.body.collideWorldBounds = true;

                player.animations.add( 'left',  [0,1,2,3], 10, true );
                player.animations.add( 'right', [4,5,6,7], 10, true );

                player.anchor.setTo(0.5 ,0.5);

                game.camera.follow(player);

                cursors = game.input.keyboard.createCursorKeys();

                map = game.add.tilemap('level_1');

                map.addTilesetImage('dg_features32');
                map.addTilesetImage('star');


                map.setCollisionBetween(1, 12);

                // 28 it's id of tile death
                map.setTileIndexCallback(28, death, this);

                // WTF?! This will set the map location 2, 0 to call the function
                map.setTileLocationCallback(0, 0, 1, 1, death, this);


                //  Here we create our coins group
                coins = game.add.group();
                coins.enableBody = true;

                map.createFromObjects('Object Layer 1', 8, 'coin', 0, true, false, coins);

                coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
                coins.callAll('animations.play', 'animations', 'spin');


                game.physics.arcade.enable(coins);


                coins_count = coins.length;


                layer = map.createLayer('Tiled layers 1');

                layer.resizeWorld();
                //  layer.debug = true;


                //  The score
                scoreText = game.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: '#FFFFFF' });
                scoreText.fixedToCamera = true;

                livesText = game.add.text(game.world.width - 8, 16, 'Lives: ' + lives , { fontSize: '32px', fill: '#FFFFFF' });
                livesText.fixedToCamera = true;

            break;
            case 2:

                console.log("level 2");

            break;
            case 3:

            break;
        }
            
    }





    function create () {

        load_menu();

    }

    function update () {

        if (isGameStarted) {

            game.physics.arcade.collide(player, layer, collidePlayerWithWalls, null, this);
            game.physics.arcade.collide(coins, layer, collideCoinsWithWalls, null, this);
            game.physics.arcade.overlap(player, coins, collectCoin, null, this);


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

                if (!isFly) {
                    isFly = true;
                }
                if (player.body.gravity.y > 0 ) {
                    player.body.gravity.y *= -1;
                    player.scale.y *= -1;

                    coins.forEach( function (L) {
                        L.body.gravity.y = -600;
                    })
                    
                }

            } else if(cursors.down.isDown) {

                if (!isFly) {
                    isFly = true;
                }
                if (player.body.gravity.y < 0 ) {
                    player.body.gravity.y *= -1;
                    player.scale.y *= -1;   

                    coins.forEach(function(L){
                        L.body.gravity.y = 600;
                    })
                }

            } else {
                player.animations.stop();
                player.frame = 4;
            }
        }

        
    }

    function collidePlayerWithWalls () {

        if( isFly ) {
            isFly = false;
        } 
    }

    function collideCoinsWithWalls() {
        console.warn('collideCoinsWithWalls');
    }


    function death (sprite) {

        if(sprite != player) {
            return;
        }

        isGameStarted = false;

        console.warn('You are dead!');
        lives -= 1;
        livesText.text = "Lives: " + lives;

        erase_all();


        if( lives <= 0 ) {
            game_over();
        } else {
            load_level();
        }

       


    }

    function erase_all () {

        player.kill();
        layer.destroy();
        //cursors.destroy();
        map.destroy();
        coins.destroy();
        scoreText.destroy();
        livesText.destroy();


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