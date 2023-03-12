const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const btnPlay = document.querySelector('.btn-play');
const spanPlay = document.querySelector('#play');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};

const bombExploted = {
    x: undefined,
    y: undefined,
};


let enemyPositions = [];

btnPlay.addEventListener('click', playGame);
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    //canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10 - 2;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    spanPlay.innerHTML = 'PLAY' + '🎮';
    // startGame();
}

function playGame() {
    timeStart = undefined;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    pResult.innerHTML = '';
    btnPlay.classList.toggle('inactive');

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }
    level = 0;
    // lives = 3;
    startGame();
}

function startGame() {
    //console.log({ canvasSize, elementsSize });

    game.font = elementsSize + 'px Verdana';
    //game.textAlign = 'end';

    const map = maps[level];
    console.log(level);
    if (!map) {
        gameWin();
        return;
    }

    if (lives == 0) {
        game.clearRect(0, 0, canvasSize, canvasSize);
        gameOver();
        return;
    }

    // if (!timeStart) {
    //   timeStart = Date.now();
    //  timeInterval = setInterval(showTime, 100);
    showRecord();
    // }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    //console.log({ map, mapRows, mapRowCols });

    showLives();

    enemyPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                //doorPosition.x = posX;
                //doorPosition.y = posY;
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;

                    //console.log({ playerPosition });
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        // console.log('Subiste de nisvel!');
        levelUp();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        let enemyCollisionX = false;
        let enemyCollisionY = false;
        if ((enemy.x.toFixed(3) == playerPosition.x.toFixed(3)) && (enemy.y.toFixed(3) == playerPosition.y.toFixed(3))) {
            enemyCollisionX = true;
            enemyCollisionY = true;
            bombExploted.x = enemy.x;
            bombExploted.y = enemy.y;

        }
        game.fillText(emojis['BOMB_COLLISION'], bombExploted.x, bombExploted.y);

        //  enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        // const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        // console.log('Chocaste contra un enemigo :(');
        setTimeout(levelOver, 1000);
        //levelOver();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
}

function levelUp() {
    level++;
    startGame();
}

function gameOver() {

    spanPlay.innerHTML = 'LOSE!' + emojis['GAME_OVER'];
    btnPlay.classList.toggle('inactive');
    bombExploted.x = undefined;
    bombExploted.y = undefined;
    clearInterval(timeInterval);
    // lives = 3;
}

function levelOver() {
    lives--;


    if (lives == 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
        gameOver();
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    spanPlay.innerHTML = 'WIN!' + emojis['WIN'];
    btnPlay.classList.toggle('inactive');

    console.log('ganaste chancletaa!!');
    clearInterval(timeInterval);

    const playerTime = Date.now() - timeStart;
    const recordTime = localStorage.getItem('record_time');

    if (recordTime) {

        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'SUPERASTE EL RECORD!!!';
        }
        else {
            pResult.innerHTML = 'Lo siento, no superaste el record :c';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Lo lograste!!! FELICIDADES c:';
    }

}

function showLives() {
    //const heartArr = Array(lives).fill(emojis['HEART']);
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

function moveUp() {
    if (playerPosition.y.toFixed(4) > elementsSize) {
        playerPosition.y -= elementsSize;
        // console.log(giftPosition);
        // console.log(playerPosition);
        // console.log(elementsSize)
        startGame();
    }
}

function moveRight() {
    if (playerPosition.x.toFixed(4) < canvasSize * 0.8) {
        playerPosition.x += elementsSize;
        //  console.log(playerPosition);
        startGame();
    }
}
function moveDown() {
    if (playerPosition.y.toFixed(4) < canvasSize * 0.9) {
        playerPosition.y += elementsSize;
        //console.log(playerPosition);
        startGame();
    }
}
function moveLeft() {
    if (playerPosition.x.toFixed(4) > 10) {
        playerPosition.x -= elementsSize;
        // console.log(playerPosition);
        startGame();
    }
}