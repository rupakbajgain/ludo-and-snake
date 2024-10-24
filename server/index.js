//index.js
const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');
const { setMaxIdleHTTPParsers } = require('http');
const path = require('path');

const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// whole game status
var gameState = {
  players: [
    {icon:'/res/user2.jpg', name: 'User2', online: 0, color: 'green' , locked: false},
    {icon:'/res/user1.jpg', name: 'User1', online: 0, color: 'blue', locked: false }
  ],
  gameStatus: 'WAITING',//WAITING,PLAYING
  rollDice: false,
  requestMove: false,
  currentPlayer: 1,
  diceValue: 1,
  config: {
    boardSize: 5,
    noPieces: 2,
    stars: 2,
    noJumps: 4,
  },
  gameMessage: 'Click go to continue.',
  chat: [
    [2, 'Welcome to lazy ludo']]
};

var hidden = {
}

function startGame(io){
  gameState.gameStatus='PLAYING';
  Notify('Starting the game',io);
  const tot=gameState.config.boardSize*gameState.config.boardSize;

  let board={};

  let tracked=[0,tot-1];
  function getOne(){
    while(true){
      let randomPos=Math.floor(Math.random()*tot);
      if(!tracked.includes(randomPos)){
        return randomPos;
      }
    }
  }

  let stars=[];
  for(let i=0;i<gameState.config.stars;i++){
    const k=Math.floor(tot/(gameState.config.stars+1)*(i+1));
    tracked.push(k);
    stars.push(k);
  }
  board.stars=stars;

  board.pieces=[];
  for(let i in gameState.players){
    for(let j=0;j<gameState.config.noPieces;j++){
      board.pieces.push([i,0]);
    }
  }

  const minJump=gameState.config.boardSize*2+1;
  const maxJump=gameState.config.boardSize*Math.sqrt(gameState.config.boardSize);
  const diff=maxJump-minJump;
  hidden.snakes=[]

    while(hidden.snakes.length<gameState.config.noJumps*2){
      const j=Math.floor(Math.random()*diff)+minJump;

      const i1 = getOne();
      const i2 = getOne();
      
      if(i1==i2 || (i1+j)==(i2-j))continue;
      if(i1+j>tot || tracked.includes(i1+j))continue;
      if(i2-j<0 || tracked.includes(i2-j))continue;
      hidden.snakes.push([i1,i1+j])
      hidden.snakes.push([i2,i2-j])
    }
    console.log(hidden);

  gameState.board=board;
  io.emit('UPDATE_BOARD', board);
  io.emit('GAME_STATUS', 'PLAYING');
}

function reset(){
  gameState.players[0].locked=false;
  gameState.players[1].locked=false;
  gameState.gameStatus='WAITING';
  io.emit('GAME_STATUS', 'WAITING');
}

function Notify(msg, io){
  io.emit('NOTIFY', msg);
  gameState.gameMessage=msg;
}

function movePiece(pid, pos, io){
  const pieces=gameState.board.pieces;
  const tot=gameState.config.boardSize*gameState.config.boardSize-1;
  let pathlist=[]

  function filledPathList(fv){
    let lasPv=pathlist[pathlist.length-1];
    for(let i=lasPv;i<=fv;i++){
      pathlist.push(i);
    }
  };

  for(let i in pieces){
    if(pieces[i][0]==pid && pieces[i][1]==pos){
      pathlist.push(pos);
      let pf=pos+gameState.diceValue;
      
      //check if it cuts any pieces
      for(let j in pieces){
        if(pieces[j][0]!=pid && pf==pieces[j][1]){
          let isSafe=false;
          if(pieces[j][1]==tot || pieces[j][1]==0)
            isSafe=true;
          for(let k in gameState.board.stars)
            if(gameState.board.stars[k]==pieces[j][1])
              isSafe=true;
          if(!isSafe)pieces[j][1]=0;
        }
      };

      // check if reaches more than end, true if no other valid move available else force with false
      if(pf>tot){
        for(let j in pieces){
          if(pieces[j][0]==pid && pieces[j][1]+gameState.diceValue<tot)
            return false;
        }
        return true;
      }

      // check if player wins
      if(pf==tot){
        gameState.currentPlayer=(gameState.currentPlayer+1)%2;//rotate turn
        let gao=true;
        for(let j in pieces){
          if(i!=j && pieces[j][0]==pid && pieces[j][1]!=tot)
            gao=false;
        }
        //console.log(pieces);
        if(gao){
          let msg=`${gameState.players[pid].name} wins`;
          Notify(msg, io);
          sendMessage(msg, io);
          reset();
          return false;
          //console.log('GO');
        }
      }

      filledPathList(pf);
      //check for jumps
      for(let j in hidden.snakes){
        if(hidden.snakes[j][0]==pf){
          pf=hidden.snakes[j][1]
          pathlist.push(pf);
          break;
        }
      }

      pieces[i][1]=pf;

      gameState.board.pathlist=pathlist;
      return true;
    }
  }  
  return false;
}

function sendMessage(m, io){
  const msg = [2, m];
  gameState.chat.push(msg);
  //console.log(msg);
  io.emit('MESSAGE', msg);
}

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
//console.log(appDir)
var player = require('play-sound')()


io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('disconnect', () => {
      if(socket.pid===undefined)return;
      gameState.players[socket.pid].online--;
      //console.log(socket);
      io.emit('PLAYER_DISCONNECTED', {id: socket.pid});
      console.log('🔥: A user disconnected', socket.pid);
    });
    socket.on('PLAYER_CONNECTED', (p)=>{
      socket.pid = p.id;
      io.emit('PLAYER_CONNECTED', {id: p.id});
      gameState.players[socket.pid].online++;
      player.play(appDir+'/beep.wav', function (err) {
     if (err) throw err;
       console.log("Audio finished");
     });
      //console.log(gameState.players);
      //console.log(socket);
    })
    socket.on('MESSAGE', p=>{
      const msg = [socket.pid, p.msg];
      gameState.chat.push(msg);
      //console.log(msg);
      io.emit('MESSAGE', msg);
    })
    socket.on('COLOR', p=>{
      const msg = {id: socket.pid,color: p.color};
      gameState.players[socket.pid].color=p.color;
      //console.log(msg);
      io.emit('COLOR', msg);
    })
    socket.on('CANVAS_CLICK', p=>{
      if(!gameState.requestMove || socket.pid!=gameState.currentPlayer)return;
      //console.log(p);
      if(movePiece(socket.pid, p, io)){
        io.emit('UPDATE_BOARD', gameState.board)
        if(gameState.diceValue!=6)gameState.currentPlayer=(gameState.currentPlayer+1)%2;
        gameState.rollDice=true;
        gameState.requestMove=false;
        Notify(`${gameState.players[gameState.currentPlayer].name} turn to roll dice.`, io);
        let mg={cplayer: gameState.currentPlayer}
        io.emit('REQ_DICEROLL', mg);
      };
    })
    socket.on('DICEROLL', p=>{
      if(!gameState.rollDice || socket.pid!=gameState.currentPlayer)return;
      const msg = {id: socket.pid, value: p.res};
      gameState.diceValue=p.res;
      gameState.rollDice=false;
      //console.log(msg);
      io.emit('DICEROLL', msg);
      Notify(`${gameState.players[socket.pid].name}'s turn [Dice: ${p.res}]`,io);
      gameState.requestMove=true;
    })
    socket.on('SET_LOCKED', p=>{
      const msg = {id: socket.pid, locked: p};
      gameState.players[socket.pid].locked=p;
      //console.log(msg);
      io.emit('SET_LOCKED', msg);
      if(p){
        if(gameState.players[(socket.pid+1)%2].locked){
          startGame(io);
          gameState.currentPlayer=Math.floor(Math.random()*2);
          gameState.rollDice=true;
          Notify(`${gameState.players[gameState.currentPlayer].name} turn to roll dice.`, io);
          let mg={cplayer: gameState.currentPlayer}
          io.emit('REQ_DICEROLL', mg);
        }
      }
    })
});

app.use(cors());

app.get('/gameState', (req, res) => {
  res.json(gameState);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
