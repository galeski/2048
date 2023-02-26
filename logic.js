let currentState = undefined;
let debug = false;

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

// TODO: add logic
const checkIfSolvable = (gameState) => {};

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

  if (randomField === undefined) {
    return gameState;
  }
  const row = randomField[0];
  const col = randomField[1];
  gameState[row][col] = 2;
  console.log(typeof acc);
  // FIXME: broken
  // changeColor(String(acc));
  console.log(randomField, acc);

  // // FIXME: duplication of logic
  // acc = 0;
  // for (let row = 0; row < gameState.length; row++) {
  //   for (let col = 0; col < gameState[0].length; col++) {
  //     if (acc === randomField) {
  //       gameState[row][col] = 2;
  //       console.log(row, col, acc);
  //       changeColor(String(acc));
  //     }
  //     acc++;
  //   }
  // }

  return acc;
};

const changeColor = (element, color = "lightblue") => {
  document.getElementById(element).style.background = color;
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

  // if (!right) {
  //   count = 0;
  //   for (let i = 0; i < arr.length; i++) {
  //     if (arr[i] !== 0) {
  //       arr[count++] = arr[i];
  //     }
  //   }

  //   for (let i = count; i < arr.length; i++) {
  //     arr[i] = 0;
  //   }
  // } else {
  //   count = arr.length - 1;
  //   for (let i = arr.length - 1; i >= 0; i--) {
  //     if (arr[i] !== 0) {
  //       arr[count--] = arr[i];
  //     }
  //   }

  //   for (let i = 0; i < count; i++) {
  //     arr[i] = 0;
  //   }
  //   return arr.reverse();
  // }

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

  // if (gameStateField[0] === gameStateField[1]) {
  //   gameStateField[0] = gameStateField[0] + gameStateField[1];
  //   gameStateField[1] = 0;
  // }
  // if (gameStateField[1] === gameStateField[2]) {
  //   gameStateField[1] = gameStateField[1] + gameStateField[2];
  //   gameStateField[2] = 0;
  // }
  // if (gameStateField[2] === gameStateField[3]) {
  //   gameStateField[2] = gameStateField[2] + gameStateField[3];
  //   gameStateField[3] = 0;
  //   console.log(gameStateField[2], gameStateField[3]);
  // }

  // // TODO: squashing ? ie [2, 0, 0, 2] -> move left = [4, 0, 0, 0]
  // if (gameStateField[0] === gameStateField[2] && gameStateField[1] === 0) {
  //   gameStateField[0] = gameStateField[0] + gameStateField[2];
  //   gameStateField[2] = 0;
  // }
  // if (
  //   gameStateField[0] === gameStateField[3] &&
  //   gameStateField[1] === 0 &&
  //   gameStateField[2] === 0
  // ) {
  //   gameStateField[0] = gameStateField[0] + gameStateField[3];
  //   gameStateField[3] = 0;
  // }

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
    updateDivs(gameState);
  } else {
    console.log("fields are the same, no movement");
  }
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
  // move(currentState, "left");
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
  // move(currentState, "left");
}

function test3() {
  // setField(currentState, 0, 0, 8);
  // setField(currentState, 0, 1, 8);
  // setField(currentState, 0, 2, 8);
  // setField(currentState, 0, 3, 8);

  // setField(currentState, 1, 0, 0);
  // setField(currentState, 1, 1, 8);
  // setField(currentState, 1, 2, 32);
  // setField(currentState, 1, 3, 8);

  // setField(currentState, 2, 0, 0);
  // setField(currentState, 2, 1, 32);
  // setField(currentState, 2, 2, 64);
  // setField(currentState, 2, 3, 32);

  setField(currentState, 3, 0, 2);
  setField(currentState, 3, 1, 0);
  setField(currentState, 3, 2, 2);
  setField(currentState, 3, 3, 0);
  // move(currentState, "left");
}

function test4() {
  // setField(currentState, 0, 0, 8);
  // setField(currentState, 0, 1, 8);
  // setField(currentState, 0, 2, 8);
  // setField(currentState, 0, 3, 8);

  // setField(currentState, 1, 0, 0);
  // setField(currentState, 1, 1, 8);
  // setField(currentState, 1, 2, 32);
  // setField(currentState, 1, 3, 8);

  // setField(currentState, 2, 0, 0);
  // setField(currentState, 2, 1, 32);
  // setField(currentState, 2, 2, 64);
  // setField(currentState, 2, 3, 32);

  setField(currentState, 3, 0, 0);
  setField(currentState, 3, 1, 2);
  setField(currentState, 3, 2, 2);
  setField(currentState, 3, 3, 2);
  // move(currentState, "left");
}
