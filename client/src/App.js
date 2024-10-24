import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayerInfo from './components/PlayerInfo';
import Chat from './components/Chat';
import Dice from './components/Dice';
import Color from './components/Color';
import Go from './components/Go';
import GameCanvas from './components/GameCanvas';

import React, { Component, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const state = useSelector((state) => state);
  //console.log(state);
  const rollDice = useSelector((state) => state.gameState.rollDice);
  const [showElement,setShowElement] = useState(rollDice);
  //console.log(state);

  useEffect(()=>{
    //console.log(showElement);
    if(rollDice){
      setShowElement(true)
    }else{
      setTimeout(function() {
        setShowElement(false)
      }, 2000);
    }
  },[rollDice]);

  if(!state.isStateLoaded)return(<div className='loader'></div>);

  const player=state.gameState.players[state.currentPlayer];
  const nextPlayer=state.gameState.players[(state.currentPlayer+1)%2];
  return (
  <div className="bodyMain">
    <PlayerInfo player={nextPlayer}/>
    <div className="middle">
        <div className='mainGame'>
          {state.gameState.gameStatus=='WAITING'?
            <div className='settings-grid'>
          <div style={{padding:'20px'}}>Config
            <div>
              {Object.keys(state.gameState.config).map(x=>
                <p key={x}>
                  <span>{x}</span> : 
                  <span>{state.gameState.config[x]}</span>
                </p>
              )}
            </div>
          </div>
          <Color />
          <Go />
            </div>
            :
          <GameCanvas/>
          }
          {showElement && <div className='overflown'><Dice/></div>}
        </div>
        <Chat/>
    </div>
    <PlayerInfo player={player} textinput/>
  </div>
  );
};

export default App;