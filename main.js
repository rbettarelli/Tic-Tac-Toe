const squares = Array.from(document.querySelectorAll("#board div"));
const messages = document.querySelector("h2");
const cellElements = document.querySelectorAll(".square");
const turn = document.querySelector(".turn");
const resetContainer = document.querySelector('.reset-container')

const defaultPlayer = (name, sideID, type) => {
  let playerName = name;

  const playerSide = document.querySelector(`#${sideID}`);
  const showPlayer = playerSide.querySelector(".player-name");

  const setName = (newName) => {
    playerName = newName || name;
  };

  const playerScore = playerSide.querySelector(".player-wins");

  let win = 0;

  const getName = () => playerName;

  const isCPU = () => type === "cpu";

  const addWin = () => {
    win++;
    playerScore.innerHTML = win;
    console.log(win);
  };
  const getWin = () => win;

  const resetWin = () => {
    win = 0;
    playerScore.innerHTML = "";
  };

  const showCurrentPlayer = () => {
    showPlayer.classList.add('showCurrent')
  };

  const removeCurrentPlayer = () => {
    showPlayer.classList.remove('showCurrent')
  };

  return {
    setName,
    getName,
    showCurrentPlayer,
    removeCurrentPlayer,
    isCPU,
    addWin,
    getWin,
    resetWin,
  };
};

(function () {
  let nameInput1 = document.querySelector("#p1-name");
  let nameInput2 = document.querySelector("#p2-name");

  nameInput1.addEventListener("change", (e) => {
    player1.setName(e.target.value);
  });

  nameInput2.addEventListener("change", (e) => {
    player2.setName(e.target.value);
  });
})();

//START BUTTON

let player1 = defaultPlayer("Player 1", "p1-side", "player");
let player2 = undefined;

(function () {
  
  let board = document.getElementById("board");
  let startBtn = document.querySelector(".start-game");
  let playerBtn = document.querySelector(".human");
  let cpuBtn = document.querySelector(".ai");

  playerBtn.addEventListener("click", () => {
    player2 = defaultPlayer("Player 2", "p2-side", "player");
    cpuBtn.style.display = "none";
    playerBtn.classList.add('btnOnClick')
  });

  cpuBtn.addEventListener("click", () => {
    player2 = defaultPlayer("Player 2", "p2-side", "cpu");
    playerBtn.style.display = "none";
    cpuBtn.classList.add('btnOnClick')
  });

  startBtn.addEventListener("click", () => {
    if (defaultPlayer.type === "player") {
      cpuBtn.style.border = "none";
    } else if (defaultPlayer.type ==='cpu') {
      playerBtn.style.border = "none";
    }
    startBtn.style.display ='none'
    resetContainer.style.display = 'block'
    board.style.display = "grid";
    GAME_BOARD.startGame();
  });
})();

const resetBtn = document.getElementById("reset-button");
resetBtn.addEventListener("click", () => {
  window.location.reload();
});

// CPU PLAYER
const CPU_PLAYER = (function () {
  const getRobotMoveIndex = (gameArr) => {
    let possibleMoves = [];
    for (let i = 0; i < gameArr.length; i++) {
      if (gameArr[i] === "") {
        possibleMoves.push(i);
      }
    }

    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    return possibleMoves[randomIndex];
  };
  return { getRobotMoveIndex };
})();

//GAME-BOARD

const GAME_BOARD = (function () {
  let boardArr = ["", "", "", "", "", "", "", "", ""];
  let symbol = "X";
  let isPlaying = false;
  let currentPlayer = undefined;
  let maximumFlags = 5;

  const startGame = () => {
    isPlaying = true;
    currentPlayer = player1;
    currentPlayer.showCurrentPlayer();

    squares.forEach((square) => {
      square.addEventListener("click", () => {
        let index = squares.indexOf(square);
        if (isPlaying && boardArr[index] === "") {
          fillSquare(index);
          if (checkWinCondition()) {
            //win
            isPlaying = false;
            currentPlayer.addWin();
            restart();
          } else if (boardArr.filter((elem) => elem).length === 9) {
            isPlaying = false;
            restart();
          } else {
            handleTurn();
            if (player2.isCPU()) {
              isPlaying = false;
              setTimeout(() => {
                fillSquare(CPU_PLAYER.getRobotMoveIndex(boardArr));
                if (checkWinCondition()) {
                  currentPlayer.addWin();
                  restart();
                } else if (boardArr.filter((elem) => elem).length === 9) {
                  restart();
                } else {
                  isPlaying = true;
                  handleTurn();
                }
              }, 800);
            }
          }
        }
      });
    });
  };

  const restart = () => {
    setTimeout(clearBoard, 1800);
    if (player1.getWin() < maximumFlags && player2.getWin() < maximumFlags) {
      handleTurn();
      if (currentPlayer === player2 && player2.isCPU()) {
        setTimeout(() => {
          fillSquare(CPU_PLAYER.getRobotMoveIndex(boardArr));
          isPlaying = true;
          handleTurn();
        }, 2600);
      } else {
        setTimeout(() => (isPlaying = true), 2200);
      }
    } else {
      setTimeout(endGame, 2000);
    }
  };

  const handleTurn = () => {
    symbol = symbol === "X" ? "O" : "X";
    currentPlayer.removeCurrentPlayer();
    currentPlayer = currentPlayer == player1 ? player2 : player1;
    currentPlayer.showCurrentPlayer();
  };

  const endGame = () => {
    let p1win = ["P", "1", "", "w", "o", "n", "", "", ""];
    let p2win = ["", "P", "2", "w", "o", "n", "", "", ""];

    let winnerArr = player1.getWin() === maximumFlags ? p1win : p2win;

    squares.forEach((square) => {
      let index = squares.indexOf(square);
      symbol = winnerArr[index];
      fillSquare(index);
    });
  };

  const fillSquare = (index) => {
    boardArr[index] = symbol;
    let spanText = document.createElement("span");
    spanText.classList.add("text");
    spanText.innerText = symbol;
    cellElements[index].appendChild(spanText);
  };

  const checkWinCondition = () => {
    if (
      (boardArr[0] === symbol &&
        boardArr[1] === symbol &&
        boardArr[2] === symbol) ||
      (boardArr[3] === symbol &&
        boardArr[4] === symbol &&
        boardArr[5] === symbol) ||
      (boardArr[6] === symbol &&
        boardArr[7] === symbol &&
        boardArr[8] === symbol) ||
      (boardArr[0] === symbol &&
        boardArr[3] === symbol &&
        boardArr[6] === symbol) ||
      (boardArr[1] === symbol &&
        boardArr[4] === symbol &&
        boardArr[7] === symbol) ||
      (boardArr[2] === symbol &&
        boardArr[5] === symbol &&
        boardArr[8] === symbol) ||
      (boardArr[0] === symbol &&
        boardArr[4] === symbol &&
        boardArr[8] === symbol) ||
      (boardArr[2] === symbol &&
        boardArr[4] === symbol &&
        boardArr[6] === symbol)
    )
      return true;
    else return false;
  };

  const clearBoard = () => {
    boardArr = ["", "", "", "", "", "", "", "", ""];

    squares.forEach((square) => {
      let span = square.firstElementChild;

      if (span !== null) {
        span.addEventListener("animationed", () => {
          square.innerHTML = "";
        });
        square.innerHTML = "";
      } else {
        square.innerHTML = "";
      }
    });
  };

  const resetGame = () => {
    player1.resetWin();
    player2.resetWin();
    clearBoard();
    setTimeout(() => {
      isPlaying = true;
      currentPlayer = player1;
      symbol = "x";
      currentPlayer.showCurrentPlayer();
    }, 400);
  };

  return { startGame, resetGame };
})();
