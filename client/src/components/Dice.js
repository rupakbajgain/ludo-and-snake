import React, { useState,useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { SketchPicker } from 'react-color'

const Dice = (props) => {
    const value = useSelector((state) => state.gameState.diceValue);
    const player = useSelector((state) => state.currentPlayer);
    const gplayer = useSelector((state) => state.gameState.currentPlayer);
    const dispatch = useDispatch();
    const dice= useRef(null);

    function rollDice() {
      var diceOne   = Math.floor((Math.random() * 6) + 1);
      //console.log(diceOne);
      if(player!=gplayer)return;
      let c2=`show-${(value+1)%6}`;
      dice.current.classList.add(c2);
      dice.current.classList.add(`show-${value}`);
      setTimeout(()=>{
        dice.current.classList.remove(c2);
      }, 500);
      dispatch({emit:'DICEROLL',x: {res: diceOne}});
    };
    return (
      <div ref={dice} className={`dice show-${value}`} onClick={rollDice}>
      <div className='side one'>
        <div className="dot one-1"></div>
      </div>
      <div className='side two'>
        <div className="dot two-1"></div>
        <div className="dot two-2"></div>
      </div>
      <div className='side three'>
        <div className="dot three-1"></div>
        <div className="dot three-2"></div>
        <div className="dot three-3"></div>
      </div>
      <div className='side four'>
        <div className="dot four-1"></div>
        <div className="dot four-2"></div>
        <div className="dot four-3"></div>
        <div className="dot four-4"></div>
      </div>
      <div className='side five'>
        <div className="dot five-1"></div>
        <div className="dot five-2"></div>
        <div className="dot five-3"></div>
        <div className="dot five-4"></div>
        <div className="dot five-5"></div>
      </div>
      <div  className='side six'>
        <div className="dot six-1"></div>
        <div className="dot six-2"></div>
        <div className="dot six-3"></div>
        <div className="dot six-4"></div>
        <div className="dot six-5"></div>
        <div className="dot six-6"></div>
      </div>
    </div>
    )
};

export default Dice;