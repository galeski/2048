let currentState = undefined;
let debug = false;
let score = 1;

const initializeGame = () => {
  const fields = new Array(4).fill(0).map(() => new Array(4).fill(0));

  return fields;
};

const randomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min - 1) + min);
};

const randomFromArr = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const compareArr = (arr1, arr2) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2) ? true : false;
};

const randomNumberDivisibleByTwo = (min, max) => {
  let randomStop = randomIntInRange(min, max);
  for (let i = min; i < max; i *= 2) {
    if (i >= randomStop) {
      return i;
    }
  }
  return min;
};

const startingState = () => {
  let game = initializeGame();

  // we should sanitize fields, if a game is going on
  for (let i = 0; i < 15; i++) {
    document.getElementById(String(i)).textContent = undefined;
  }

  let startingVal1 = randomIntInRange(0, 15);
  let startingVal2 = randomIntInRange(0, 15);

  while (startingVal1 === startingVal2) {
    startingVal2 = randomIntInRange(0, 15);
  }

  // we should update game state
  let currField = 0;
  for (let row = 0; row < game[0].length; row++) {
    for (let col = 0; col < game.length; col++) {
      if (currField === startingVal1) {
        game[row][col] = randomNumberDivisibleByTwo(2, 4);
        document.getElementById(String(startingVal1)).textContent = String(
          game[row][col]
        );
      }
      if (currField === startingVal2) {
        game[row][col] = randomNumberDivisibleByTwo(2, 4);
        document.getElementById(String(startingVal2)).textContent = String(
          game[row][col]
        );
      }

      currField++;
    }
  }

  console.log(game);

  return game;
};

// TODO: refactor this
const checkIfSolvable = (gameState) => {
  let didWeLoseYet = 8;
  for (let row = 0; row < gameState.length; row++) {
    if (
      gameState[row][0] !== gameState[row][1] &&
      gameState[row][1] !== gameState[row][2] &&
      gameState[row][2] !== gameState[row][3] &&
      gameState[row][0] !== 0 &&
      gameState[row][1] !== 0 &&
      gameState[row][2] !== 0 &&
      gameState[row][3] !== 0
    ) {
      didWeLoseYet--;
    }
  }

  for (let row = 0; row < gameState.length; row++) {
    for (let col = 0; col < gameState[row].length; col++) {
      console.log(currentState[col][row]);
      if (
        gameState[0][row] !== 0 &&
        gameState[1][row] !== 0 &&
        gameState[2][row] !== 0 &&
        gameState[3][row] !== 0 &&
        gameState[0][row] !== gameState[1][row] &&
        gameState[1][row] !== gameState[2][row] &&
        gameState[2][row] !== gameState[3][row]
      ) {
        didWeLoseYet--;
      }
    }
  }

  if (didWeLoseYet === -12) {
    document.getElementById("message").innerHTML = "You lost. Try again!";
  }

  if (gameState.flat().indexOf(2048) !== -1) {
    document.getElementById("message").innerHTML = "You won the game!";
  }
};

const addRandomNumber = (gameState) => {
  let zeroValues = [];

  let acc = 0;
  for (let row = 0; row < gameState.length; row++) {
    for (let col = 0; col < gameState[0].length; col++) {
      if (gameState[row][col] === 0) {
        zeroValues.push([row, col]);
      }
      acc++;
    }
  }

  const randomField = randomFromArr(zeroValues);

  console.log(randomField);

  if (randomField === undefined) {
    return gameState;
  }
  const row = randomField[0];
  const col = randomField[1];
  gameState[row][col] = 2;

  // FIXME: just plain awful
  acc = 0;
  for (let row2 = 0; row2 < gameState.length; row2++) {
    for (let col2 = 0; col2 < gameState[0].length; col2++) {
      if (row2 === row && col2 === col) {
        changeColor(acc);
        break;
      }
      acc++;
    }
  }

  return acc;
};

const changeColor = (element, color = "lightblue") => {
  document.getElementById(String(element)).style.background = color;
  setTimeout(function () {
    changeColor(element, "#fff");
  }, 1000);
};

const updateDivs = (gameState) => {
  let currField = 0;
  for (let row = 0; row < gameState[0].length; row++) {
    for (let col = 0; col < gameState.length; col++) {
      // don't update when zero, left blank
      if (gameState[row][col] === 0) {
        document.getElementById(String(currField)).textContent = "";
      } else {
        document.getElementById(String(currField)).textContent =
          gameState[row][col];
      }
      currField++;
    }
  }
};

const setField = (gameState, x, y, val) => {
  gameState[x][y] = val;
  updateDivs(gameState);
};

// www.stackoverflow.com/questions/33345529/
const moveZeroes = (arr, right = false) => {
  // let count = undefined;
  let fieldsWithZeroesAtEnd = new Array(4).fill(0);
  let idx;

  if (!right) {
    idx = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 0) {
        fieldsWithZeroesAtEnd[idx] = arr[i];
        idx++;
      }
    }
  } else if (right) {
    idx = arr.length;
    for (let i = arr.length; i >= 0; i--) {
      if (arr[i] !== 0) {
        fieldsWithZeroesAtEnd[idx] = arr[i];
        idx--;
      }
    }
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = fieldsWithZeroesAtEnd[i];
  }

  return arr;
};

/**
 * Solve a row of gameState array. Can be used for columns, if they are
 * made into row-like array beforehand.
 *
 * @param   {Array} gameStateField
 * @returns {Array} gameStateField (solved)
 */
const solveField = (gameStateField, direction = null) => {
  moveZeroes(gameStateField);

  if (direction === "left" || direction === "up") {
    if (gameStateField[0] === gameStateField[1]) {
      gameStateField[0] = gameStateField[0] + gameStateField[1];
      gameStateField[1] = 0;
    }
    if (gameStateField[1] === gameStateField[2]) {
      gameStateField[1] = gameStateField[1] + gameStateField[2];
      gameStateField[2] = 0;
    }
    if (gameStateField[2] === gameStateField[3]) {
      gameStateField[2] = gameStateField[2] + gameStateField[3];
      gameStateField[3] = 0;
    }
  } else {
    if (gameStateField[2] === gameStateField[3]) {
      gameStateField[2] = gameStateField[2] + gameStateField[3];
      gameStateField[3] = 0;
    }
    if (gameStateField[1] === gameStateField[2]) {
      gameStateField[1] = gameStateField[1] + gameStateField[2];
      gameStateField[2] = 0;
    }
    if (gameStateField[0] === gameStateField[1]) {
      gameStateField[0] = gameStateField[0] + gameStateField[1];
      gameStateField[1] = 0;
    }
  }

  return gameStateField;
};

const move = (gameState, direction) => {
  // let maxVal = 0;
  let prevState = JSON.stringify(gameState);

  if (direction === "left" || direction === "right") {
    // FIXME: gameState[0] is wrong ? should affect with 4x4 though
    for (let row = 0; row < gameState[0].length; row++) {
      solveField(gameState[row], direction);

      if (direction === "left") {
        moveZeroes(gameState[row]);
      } else if (direction === "right") {
        // instead of duplicating logic, we can just reverse
        // the fields in a round about way, as in method moveZeroes
        moveZeroes(gameState[row], true);
      }

      updateDivs(gameState);
    }
  }

  if (direction === "up" || direction === "down") {
    for (let col = 0; col < gameState[0].length; col++) {
      let fieldsByCol = [];
      for (let row = 0; row < gameState.length; row++) {
        fieldsByCol.push(gameState[row][col]);
      }
      solveField(fieldsByCol, direction);
      if (direction === "up") {
        moveZeroes(fieldsByCol);
      } else if (direction === "down") {
        moveZeroes(fieldsByCol, true);
      }
      for (let row = 0; row < gameState.length; row++) {
        // reuse the row param for iterating over fieldsByCol
        gameState[row][col] = fieldsByCol[row];
      }

      updateDivs(gameState);
    }
  }

  console.log(prevState, JSON.stringify(gameState));

  if (prevState !== JSON.stringify(gameState)) {
    console.log("fields are different");
    addRandomNumber(gameState);
    score += 2;
    document.getElementById("message").innerHTML = String(score);
    updateDivs(gameState);
  } else {
    console.log("fields are the same, no movement");
  }

  checkIfSolvable(gameState);
};

const checkKey = (e) => {
  e = e || window.event;

  if (e.keyCode == "38") {
    // up arrow
    console.log("move up");
    move(currentState, "up");
  } else if (e.keyCode == "40") {
    // down arrow
    console.log("move down");
    move(currentState, "down");
  } else if (e.keyCode == "37") {
    // left arrow
    console.log("move left");
    move(currentState, "left");
  } else if (e.keyCode == "39") {
    // right arrow
    console.log("move right");
    move(currentState, "right");
  }

  console.log(e.keyCode);
};

window.addEventListener("touchstart", handleTouchStart, false);
window.addEventListener("touchmove", handleTouchMove, false);

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");

  if (!debug) {
    currentState = startingState();
  } else {
    currentState = initializeGame();
  }
});

window.onload = function () {
  document.onkeydown = checkKey;

  document.getElementById("up").onclick = function (e) {
    move(currentState, "up");
  };

  document.getElementById("down").onclick = function (e) {
    move(currentState, "down");
  };

  document.getElementById("left").onclick = function (e) {
    move(currentState, "left");
  };

  document.getElementById("right").onclick = function (e) {
    move(currentState, "right");
  };
};

/* https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android */
let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* right swipe */
      move(currentState, "right");
    } else {
      /* left swipe */
      move(currentState, "left");
    }
  } else {
    if (yDiff > 0) {
      /* down swipe */
      move(currentState, "down");
    } else {
      /* up swipe */
      move(currentState, "up");
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

// some tests
function runLeft() {
  setField(currentState, 0, 0, 2);
  setField(currentState, 0, 1, 2);
  setField(currentState, 0, 2, 2);
  setField(currentState, 0, 3, 2);

  setField(currentState, 1, 0, 4);
  setField(currentState, 1, 1, 8);
  setField(currentState, 1, 2, 4);
  setField(currentState, 1, 3, 8);

  setField(currentState, 2, 0, 16);
  setField(currentState, 2, 1, 16);
  setField(currentState, 2, 2, 16);
  setField(currentState, 2, 3, 16);

  setField(currentState, 3, 0, 32);
  setField(currentState, 3, 1, 32);
  setField(currentState, 3, 2, 32);
  setField(currentState, 3, 3, 32);
}

function runRight() {
  setField(currentState, 0, 0, 8);
  setField(currentState, 0, 1, 8);
  setField(currentState, 0, 2, 8);
  setField(currentState, 0, 3, 8);

  setField(currentState, 1, 0, 0);
  setField(currentState, 1, 1, 8);
  setField(currentState, 1, 2, 32);
  setField(currentState, 1, 3, 8);

  setField(currentState, 2, 0, 0);
  setField(currentState, 2, 1, 32);
  setField(currentState, 2, 2, 64);
  setField(currentState, 2, 3, 32);

  setField(currentState, 3, 0, 0);
  setField(currentState, 3, 1, 0);
  setField(currentState, 3, 2, 0);
  setField(currentState, 3, 3, 64);
}

function test3() {
  setField(currentState, 3, 0, 2);
  setField(currentState, 3, 1, 0);
  setField(currentState, 3, 2, 2);
  setField(currentState, 3, 3, 0);
}

function test4() {
  setField(currentState, 3, 0, 0);
  setField(currentState, 3, 1, 2);
  setField(currentState, 3, 2, 2);
  setField(currentState, 3, 3, 2);
}

function testLost() {
  setField(currentState, 0, 0, 2);
  setField(currentState, 0, 1, 4);
  setField(currentState, 0, 2, 2);
  setField(currentState, 0, 3, 4);

  setField(currentState, 1, 0, 4);
  setField(currentState, 1, 1, 2);
  setField(currentState, 1, 2, 4);
  setField(currentState, 1, 3, 2);

  setField(currentState, 2, 0, 2);
  setField(currentState, 2, 1, 4);
  setField(currentState, 2, 2, 2);
  setField(currentState, 2, 3, 4);

  setField(currentState, 3, 0, 4);
  setField(currentState, 3, 1, 2);
  setField(currentState, 3, 2, 4);
  setField(currentState, 3, 3, 2);
}

function testLost2() {
  setField(currentState, 0, 0, 2);
  setField(currentState, 0, 1, 4);
  setField(currentState, 0, 2, 2);
  setField(currentState, 0, 3, 4);

  setField(currentState, 1, 0, 8);
  setField(currentState, 1, 1, 16);
  setField(currentState, 1, 2, 8);
  setField(currentState, 1, 3, 16);

  setField(currentState, 2, 0, 32);
  setField(currentState, 2, 1, 64);
  setField(currentState, 2, 2, 32);
  setField(currentState, 2, 3, 64);

  setField(currentState, 3, 0, 4);
  setField(currentState, 3, 1, 2);
  setField(currentState, 3, 2, 4);
  setField(currentState, 3, 3, 2);
}

function testWonGame() {
  setField(currentState, 0, 0, 2048);
  setField(currentState, 0, 1, 4);
  setField(currentState, 0, 2, 2);
  setField(currentState, 0, 3, 4);

  setField(currentState, 1, 0, 8);
  setField(currentState, 1, 1, 16);
  setField(currentState, 1, 2, 8);
  setField(currentState, 1, 3, 16);

  setField(currentState, 2, 0, 32);
  setField(currentState, 2, 1, 64);
  setField(currentState, 2, 2, 32);
  setField(currentState, 2, 3, 64);

  setField(currentState, 3, 0, 4);
  setField(currentState, 3, 1, 2);
  setField(currentState, 3, 2, 4);
  setField(currentState, 3, 3, 0);
}
