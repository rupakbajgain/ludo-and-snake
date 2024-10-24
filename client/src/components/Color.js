import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { SketchPicker } from 'react-color'

const Color = (props) => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();

    const setSketchPickerColor=(c)=>{
        dispatch({emit:'COLOR', x: {color: c}});
    };
    
    const color = state.gameState.players[state.currentPlayer].color;

    return (
        <div style={{color, margin: '5px'}}>
            <h3>Color</h3>
            <SketchPicker 
              onChange={(color) => {
                setSketchPickerColor(color.hex);
              }}
              color={color}
            />
        </div>
    )
};

export default Color;