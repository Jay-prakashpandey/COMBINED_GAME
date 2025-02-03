const socket = io();

const moveSound = new Audio('/audio/move.mp3');
const winSound = new Audio('/audio/winharpsichord-39642.mp3');
const rollingSound = new Audio('/audio/rpg-dice-rolling-95182.mp3');
const killingSound = new Audio('/audio/killingsound.mp3');

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const currentUser = urlParams.get('currentUser');

let playerSymbol = null; // The symbol assigned to the current user
let activePlayer = "X"; // The player whose turn it currently is
let _board = [-1, -1, -1, -1, -1, -1, -1, -1];
let Gp1=null,Gp2=null, GdiceRoll=0;

const turnIndicator = document.getElementById("turn-indicator");

const rpath=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,53,54,55,56,57,100];
const bpath=[27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,58,59,60,61,62,100];
const safePoint=[1,9,14,22,27,35,40,48];

// Request the game state when reconnecting
socket.emit('reconnect-room', { roomId, playerName: currentUser , gameSelected: 'ludo'});

// Handle receiving the game state after reconnection
socket.on('reconnected', ({ board, currentPlayer, userSymbol, p1, p2 }) => {
    // Update the board with the current game state
    _board = board ;
    playerSymbol= userSymbol;
    Gp1 = p1;
    Gp2 = p2;
    activePlayer = currentPlayer;
    refreshBoard();
});

// Handle receiving the game state after reconnection
function handleDiceRoll()  {
    // console.log('dice roll'+GdiceRoll+' '+activePlayer+' '+playerSymbol);
    if(GdiceRoll !== 0 || activePlayer !== playerSymbol) return;
    
    GdiceRoll = Math.floor(Math.random() * 6) + 1;
    // console.log('dice rolled '+GdiceRoll);
    // Send the dice roll event to the opponent
    socket.emit("dice-roll", { roomId, diceValue: GdiceRoll, activePlayer: activePlayer });

    // animateDiceRoll(GdiceRoll, activePlayer);
}

// animation for dice roll
function animateDiceRoll(currentPlayer) {
    const currentDice = document.getElementById(`dice-image${currentPlayer === 'X' ? 'X' : 'O'}`);

    currentDice.style.animation = "none";
    currentDice.offsetHeight; // Force reflow
    currentDice.style.animation = "rotatein 2s ease";

    rollingSound.play();

    setTimeout(() => {
        currentDice.src = `/img/dice/dice-${GdiceRoll}.jpg`;
        if(!checkVallidMoves()) {
            setTimeout(() => { pieceClicked(-1);}, 1000);
        }else{
            for (let i = 0; i < 8; i++) {

                const element=document.getElementById(`p-${i}`);
                element.style.animation ="none";
                element.style.zIndex = 0;
                if((i < 4 && activePlayer === "X") || (i > 3 && activePlayer === "O")) {
                    
                    if (((_board[i] !== 56 && _board[i] !==-1) || (GdiceRoll === 6 && _board[i] === -1)) )
                    {
                        element.offsetHeight;
                        element.style.animation = "rotatein 1s ease infinite";
                        // const cs=activePlayer==='X'?'r':'b';
                        element.style.zIndex = i+1;
                        // console.log(element.innerHTML);
                        // if(_board[i] !==-1) element.innerHTML +=`<span class='${cs}p ${cs} material-icons' onclick='pieceClicked(${i})'>stars</span>`; //${_board[i]!==-1?element.innerHTML:''}`;
                        
                    }
                }
            }
        }

      }, 1000);
}

function refreshBoard(){
    document.getElementById('playerX').innerText=Gp1;
    document.getElementById('mplayerX').innerHTML=Gp1;
    document.getElementById('playerO').innerText=Gp2;
    document.getElementById('mplayerO').innerHTML=Gp2;

    for(let i=0;i<8;i++){
        const p=document.getElementById(`p-${i}`);
        const currentPath=i<4?rpath:bpath;
        let element;
        p.remove();
        if(_board[i]===-1) element=document.getElementsByClassName('player')[i>3?i+8:i];
        else element=document.getElementById(`cell-${currentPath[_board[i]]}`);
        element.append(p);
    }
    GdiceRoll=0;
    toggleDice();
}

function pieceClicked(pno){
    // console.log('piececlicked '+pno+' '+GdiceRoll+' '+activePlayer+' '+playerSymbol);
    if (_board[pno]===56 || GdiceRoll === 0 || activePlayer !== playerSymbol) return; // Only move if it's the player's turn
    if ((activePlayer === "X" && pno > 3 && pno!==-1) || (activePlayer === "O" && pno < 4 && pno!==-1)) return; // Restrict opponent piece movement
    // if(GdiceRoll===-1 || _board[pno]===100 || (_board[pno]===-1 && GdiceRoll!==6) || (pno>3 && activePlayer==='X') || (pno<4 && activePlayer==='O')) return ;
    // if(activePlayer!==playerSymbol) return ;
    socket.emit("ludo-move", { roomId: roomId ,_board:_board, _pno:pno, activePlayer: activePlayer, diceValue: GdiceRoll });
}

function checkVallidMoves(){
    
    if(GdiceRoll===0) return true;
    if(activePlayer==='X'){
        for(let i=0;i<4;i++) {
            // console.log(i);
            if((GdiceRoll===6 && _board[i]===-1) || (_board[i]!==-1 && _board[i]+GdiceRoll <=56)) return true;
        }
    }else{
        for(let i=4;i<8;i++) {
            // console.log(i);
            if((GdiceRoll===6 && _board[i]===-1) || (_board[i]!==-1 && _board[i]+GdiceRoll <=56)) return true;
        }
    }
    return false;
}

function toggleDice() {
    // activePlayer=activePlayer==='X'?'O':'X';
    document.getElementById('dice-imageX').classList.toggle('hidden', activePlayer !== "X");
    // document.getElementById('mdice-imageO').classList.toggle('hidden', activePlayer !== "O");
    document.getElementById('dice-imageO').classList.toggle('hidden', activePlayer !== "O");
    // document.getElementById('mdice-imageX').classList.toggle('hidden', activePlayer !== "X");
    for(let i=0;i<8;i++) document.getElementById(`p-${i}`).style.animation='None';
    turnIndicator.textContent = `Player ${activePlayer==='X'?Gp1:Gp2}'s Turn`;
}

function checkWinner(){
    if(_board[0]===56 && _board[1]===56 && _board[2]===56 && _board[3]===56){
        // winnner('X');
        alert('X wins');
        return true;
    }else if(_board[4]===56 && _board[5]===56 && _board[6]===56 && _board[7]===56){
        // winnner('O');
        alert('O wins');
        return true;
    }
    return false;
}

function animatePieceHome(pieceElement, targetDiv) {
    // Clone the piece to animate without affecting the original immediately
    const clone = pieceElement.cloneNode(true);
    const rect = pieceElement.getBoundingClientRect();
    
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.transition = 'all 0.5s ease-in-out';
    document.body.appendChild(clone);

    // Calculate target position
    const targetRect = targetDiv.getBoundingClientRect();
    const targetX = targetRect.left + (targetRect.width / 2) - (rect.width / 2);
    const targetY = targetRect.top + (targetRect.height / 2) - (rect.height / 2);

    // Trigger animation
    setTimeout(() => {
        clone.style.left = `${targetX}px`;
        clone.style.top = `${targetY}px`;
    }, 10);

    // Remove clone after animation and update original position
    setTimeout(() => {
        clone.remove();
        pieceElement.remove();
        targetDiv.appendChild(pieceElement);
    }, 510);
}

function checkKill(pno) {
    
    const playerPath=pno<4?rpath:bpath;

    if(safePoint.includes(playerPath[_board[pno]])) return -1;
    let killedPiece = -1;
    let flag=0;
    const currentPosition = playerPath[_board[pno]];

    if (activePlayer === "X") {
        // Check opponent's (O's) pieces (indices 4-7)
        for (let i = 4; i < 8; i++) {
            if (bpath[_board[i]] === currentPosition) {
                flag++;
                killedPiece=i;
            }
        }
    }else{
        // Check opponent's (X's) pieces (indices 0-3)
        for (let i = 0; i < 4; i++) {
            if (rpath[_board[i]] === currentPosition) {
                flag++;
                killedPiece=i;
            }
        }
    }
    if(flag===1 && killedPiece!==-1){
        _board[killedPiece] = -1; // Reset the opponent's piece position
        const pieceElement = document.getElementById(`p-${killedPiece}`);
        pieceElement.remove();
        const opponentPlayerDivIndex =killedPiece>3? 8 + killedPiece : killedPiece; // Blue's player divs are at indices 12-15
        const opponentPlayerDiv = document.querySelectorAll('.player')[opponentPlayerDivIndex];
        killingSound.play();
        opponentPlayerDiv.append(pieceElement);
        return killedPiece;
    }else{
        return -1;
    }
}

function checkMoves(pno){
    // check winner
    if(checkWinner()) return ;
    // check valid moves
    if(pno===-1 || !checkVallidMoves()) {
        // console.log('invalid move');
        activePlayer = activePlayer === "X" ? "O" : "X"; // Switch turn unless dice roll is 6
        GdiceRoll=0;
        toggleDice();
        return ;
    }
    
    let oldPos=_board[pno];
    const newPos=oldPos===-1?GdiceRoll===6?0:oldPos:oldPos+GdiceRoll;

    if((oldPos=== -1 && GdiceRoll===6) || (oldPos!==-1)){
        oldPos=oldPos===-1?0:_board[pno];
        const currentPath = pno < 4 ? rpath : bpath;

        const animationInterval = setInterval(() => {
            if (oldPos <= newPos) {
                const pieceElement=document.getElementById(`p-${pno}`);
                
                // console.log(oldPos, newPos, pno, currentPath[oldPos], pieceElement);
                
                const prev=document.getElementById(`cell-${currentPath[oldPos]}`);
                pieceElement.remove();
                moveSound.play();
                prev.append(pieceElement);
                _board[pno]=oldPos;
                
                oldPos++;
            } else {
                clearInterval(animationInterval); 
                // checkKill(pno);
                // 
                if (GdiceRoll !== 6 && newPos!==56 && checkKill(pno)===-1 ) {
                    // console.log('not kill '+GdiceRoll);
                    activePlayer = activePlayer === "X" ? "O" : "X";
                    GdiceRoll = 0;
                    toggleDice();
                }
                GdiceRoll = 0;
            }
        }, 150); // Adjust animation speed as needed
    }
}

// Handle receiving the game state after reconnection
socket.on("dice-rolled", ({ diceValue, currentPlayer }) => {
    // console.log('dice rolled '+diceValue);
    GdiceRoll = diceValue;
    activePlayer = currentPlayer;
    animateDiceRoll(currentPlayer);
});

socket.on( "updateBoard", ({board, currentPlayer, diceRoll, pno}) => {
    // console.log('updateboard');
    _board=board;
    GdiceRoll=diceRoll;
    activePlayer=currentPlayer;
    checkMoves(pno);
         
});

// Back button function 
function goBack(){
   socket.emit('back-click', {roomId});
}

socket.on('back-clicked', () => {
  window.location.href = `/room?roomId=${roomId}&currentPlayer=${currentUser}`;
});

// Reset reset button function
function resetGame(){
    socket.emit("reset-game",{ roomId } );
}

socket.on('game-reseted',({board}) => {
    _board=[-1, -1, -1, -1, -1, -1, -1, -1];
    activePlayer='X';
    refreshBoard();
});