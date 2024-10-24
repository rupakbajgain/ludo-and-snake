import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { SketchPicker } from 'react-color'

const Go = (props) => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();

    let player1 = state.gameState.players[state.currentPlayer].color;
    let player2 = state.gameState.players[(state.currentPlayer+1)%2].color;

    if(!state.gameState.players[state.currentPlayer].locked)player1='#fff';
    if(!state.gameState.players[(state.currentPlayer+1)%2].locked)player2='#fff';

    const setLocked=()=>{
        dispatch({emit:'SET_LOCKED',x: !state.gameState.players[state.currentPlayer].locked});
    };

    return (
        <>
            <button onClick={setLocked} className='go-button' style={{background:`linear-gradient(45deg, ${player2} 0%, ${player1} 100%)`}}>Go</button>
        </>
    )
};

export default Go;