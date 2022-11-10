var color1 = "#0095DD";
var gold = "#FFD700";
var green = "#00FF00";

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;
    var pause = false;
    var highScore = 0;
    var runnningTotal = 0;

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        runnningTotal++;
                        if (score == brickRowCount * brickColumnCount) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = "green";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.fillStyle = "gold";
                            ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

                            //draw the menu header
                            ctx.font = "30px Arial";
                            ctx.fillStyle = "green";
                            ctx.fillText("You Won!!", canvas.width / 2 - 50, 100);

                            
                            pause = true;
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = green;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = green;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = gold;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = gold;
        ctx.fillText("Score: " + score, 60, 20);
    }



    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = gold;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //TODO: draw message on the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "green";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "gold";
                    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

                    //draw the menu header
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "green";
                    ctx.fillText("You Lose!", canvas.width / 2 - 50, 100);
                    //togglePauseGame();
                    pause = true;
                    //document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //TODO: adjust speed
        adjustGameSpeed();
        //x += dx;
        //y += dy;

        //TODO: pause game check  
        if(!pause){
            requestAnimationFrame(draw);
        }              
        //if(!pause){
        //}
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    //pause game variable            
    //high score tracking variables
    //other variables?            

    //event listeners added
    //game speed changes handler            
    //pause game event handler            
    //start a new game event handler            
    //continue playing
    //reload click event listener            

    //Drawing a high score
    function drawHighScore() {
        if (runnningTotal > highScore) {
            highScore = runnningTotal;
        }
        ctx.font = "16px Arial";
        ctx.fillStyle = gold;
        ctx.fillText("High Score: " + highScore, 200, 20);

    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        //draw the rectangle menu backdrop
        setShadow();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "gold";
        ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

        //draw the menu header
        ctx.font = "30px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("Breakout", canvas.width / 2 - 50, 100);

        //start game button area
        ctx.fillStyle = "green";
        ctx.fillRect(100, 200, canvas.width - 200, 50);
        ctx.fillStyle = "gold";
        ctx.fillText("Start Game", canvas.width / 2 - 50, 235);

        //event listener for clicking start
        //need to add it here because the menu should be able to come back after 
        //we remove the it later 
        canvas.addEventListener("click", startGameClick, false);
        
    }

    //function used to set shadow properties
    function setShadow() {
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 10;

    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        ctx.shadowColor = "transparent";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
    };


    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu,
        canvas.removeEventListener("click", startGameClick, false);

        //clear the menu area
        
        ctx.clearRect(50, 50, canvas.width - 100, canvas.height - 100);

        //reset the shadow properties
        resetShadow();
        draw();

        //we don't want to trigger the start game click event during a game                
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        //check if the click was in the bounds of the start game button
        if(x > 100 && x < canvas.width - 0 && y > 0 && y < 1000) {
            //if so, clear the menu and start the game
            clearMenu();
        }
    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        //update the slider display 
        let speedScaleElem = document.getElementById("speedScaler");  
        let speedSlider = document.getElementById("speedSlider");
        speedSlider.addEventListener("input", function() {
            speedScaleElem.innerHTML = speedSlider.value;
        });             
        //update the game speed multiplier
        x += dx * speedSlider.value;
        y += dy * speedSlider.value;                
    };

    let pauseButton = document.getElementById("pauseButton");
    let speedScaleElem = document.getElementById("speedScaler");  
    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state
        pause = !pause;

        if(pause == false) {
            speedScaleElem.innerHTML = "Paused";
            pauseButton.innerHTML = pause;
           ctx.save();
        } else {
            speedScaleElem.innerHTML = "Playing";
            pauseButton.innerHTML = pause;
            ctx.restore();
        }
    };
    
    
    let count = 0;

    pauseButton.addEventListener("click",togglePauseGame, false); //function() {
    //    pause = !pause;
    //    count ++;
    //    if(pause) {
    //        speedScaleElem.innerHTML = "Paused";
    //        pauseButton.innerHTML = pause;
    //    } else {
    //        speedScaleElem.innerHTML = "Playing";
    //        pauseButton.innerHTML = pause;
    //    }
    //});
    //if we are not paused, we want to continue animating (hint: zyBook 8.9)

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {

    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        score = 0;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        brickRowCount = 5;
        brickColumnCount = 3;
        brickWidth = 75;
        brickHeight = 20;
        brickPadding = 10;
        brickOffsetTop = 30;
        brickOffsetLeft = 30;
        bricks = [];
        for (c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    };

    //function to reset starting game info
    function resetBoard(resetLives) {
        score = 0;
        highScore = 0;
        runnningTotal = 0;
        lives = 3;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        brickRowCount = 5;
        brickColumnCount = 3;
        brickWidth = 75;
        brickHeight = 20;
        brickPadding = 10;
        brickOffsetTop = 30;
        brickOffsetLeft = 30;
        bricks = [];
        for (c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    };

    document.getElementById("reloadButton").addEventListener("click", function() {
        window.location.reload();
    });

    document.getElementById("resetButton").addEventListener("click", function() {
        resetBoard();
    });

    document.getElementById("continueButton").addEventListener("click", function() {
        continuePlaying();
    });
    //draw the menu.
    //we don't want to immediately draw... only when we click start game            
    drawMenu();

};//end window.onload function