import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import InputEmoji from "react-input-emoji";

const PlayerInfo = (props) => {
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    const msg = useSelector((state) => state.gameState.gameMessage);

    function handleOnEnter(text) {
        dispatch({emit:'MESSAGE',x: {msg: text}});
    }

    //console.log(props.player.online);
    return (
        <div className="playerInfo" style={{background:props.player.color}}>
            <img className="playerInfo-image" src={process.env.PUBLIC_URL+props.player.icon} alt="Player Icon"/>
            <div className="potHidden" style={{marginLeft:'20px',flexGrow:1, whiteSpace: 'nowrap'}}>{props.player.name}</div>
                { props.textinput ? 
                <InputEmoji style={{flexGrow: 1}}
                value={text}
                onChange={setText}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Type a message"
                />
                    :
                    <>
                <div className='messageBar'>{msg}</div>
                <div className='dot2' style={{backgroundColor: props.player.online>0?'white':'black'}}></div>
                    </>
                }
        </div>
    )
};

export default PlayerInfo;