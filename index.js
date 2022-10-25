// with this eventListener on window we make shure that the dom is loaded
window.addEventListener("DOMContentLoaded", () => {
  //this are all the DOM element that we need
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const playerDisplay = document.querySelector(".display-player");
  const resetButton = document.querySelector("#reset");
  const announcer = document.querySelector(".announcer");

  let board = ["", "", "", "", "", "", "", "", ""]; //this will act like the board for us
  let currentPlayer = "X"; // here we are saving the current player. X or O
  let isGameActive = true; // the state of the game. Game still active ore gameover

  //this are the 3 state of the game
  const PLAYERX_WON = "PLAYERX_WON";
  const PLAYERO_WON = "PLAYERO_WON";
  const TIE = "TIE";

  /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

  //this are all of the winning possibilityes
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //verifichiamo se c'è una vincita. Se una delle winningConditions corisponde ai numeri assegnati alora  rondWon è true
  function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      const winCondition = winningConditions[i];
      const a = board[winCondition[0]];
      const b = board[winCondition[1]];
      const c = board[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue; //se la tile è vuota la saltiamo
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON); //se abbiamo un vincitore lo publichiamo e il giocco non sarà più active
      isGameActive = false;
      return;
    }

    if (!board.includes("")) announce(TIE); //se nn c'è un vincitore e non ci sono + caselle vuote, allora è un pareggio.
  }
  // announce è una helper function che ci dice il vincitore o lo stato del game. Riceve una stringa(type) che riguarda lo stato del gioco. Cosi cambiamo l'announce in html
  const announce = (type) => {
    switch (type) {
      case PLAYERO_WON:
        announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
        break;
      case PLAYERX_WON:
        announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
        break;
      case TIE:
        announcer.innerText = "Tie";
    }
    announcer.classList.remove("hide"); //togliamo il hide cosi è visibile per i players
  };

  //semplicemente verifichiamo se la tile premuta ha già un valore o no cosi che poassimo premenre solo tile vuote
  const isValidAction = (tile) => {
    if (tile.innerText === "X" || tile.innerText === "O") {
      return false;
    }

    return true;
  };
  //aggiorniamo il valore dell'elemento nell array board in una data posizione, che sia uguale al valore del player.
  const updateBoard = (index) => {
    board[index] = currentPlayer;
  };

  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer}`); //cambia il nome del player
    currentPlayer = currentPlayer === "X" ? "O" : "X"; //indicazioni su come deve cambiare
    playerDisplay.innerText = currentPlayer; //aggiorniamo il playerDisplay con il player corrente
    playerDisplay.classList.add(`player${currentPlayer}`); //aggiungiamo la classe del player
  };

  // userAction rapresenta un turno e viene attivata al click sulla tile. Verifica se: il click è isValidAction e se il giocco è ancora active. Se entrambe le condizioni sono true allora la tile avra il nome del player(X o O) e quindi la tile ricevera la classe del player con il template literal
  const userAction = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index); // aggiorniamo il nostro array
      handleResultValidation(); //verifichiamo se c'è già un vincitore
      changePlayer(); //cambiamo player
    }
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""]; //svuotiamo l'array di board
    isGameActive = true; //il gioco diventa attivo
    announcer.classList.add("hide"); //nascondiamo l'announcer

    if (currentPlayer === "O") {
      changePlayer(); //X inizia sempre, quindi sè il current player è O viene attivata la function changePlayer
    }

    //aggiorniamo il nostro UI cosi il testo di ogni tile è vuoto.
    tiles.forEach((tile) => {
      tile.innerText = "";
      tile.classList.remove("playerX");
      tile.classList.remove("playerO");
    });
  };

  //qui nel array tiles aggiungiamo un eventListener per ogni tile. Quando il Player clicca su una tile sappiamo qualle tile è ed il suo index. Ci servira la tile per modificare la visuale e l'index per aggiornare la nostra board array
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => userAction(tile, index));
  });

  //reset the board button
  resetButton.addEventListener("click", resetBoard);
});
