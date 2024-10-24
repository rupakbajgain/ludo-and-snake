import React, {useRef, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

const ChatConver = (p)=>{
    if(p.msg[0]==2)
    return (<div className='playerX'>{p.msg[1]}</div>)
    //console.log(p);
    let cName='player2';
    if (p.msg[0]==p.player){
        cName='player1'
    }
    return (<div className={cName} style={{color: p.players[p.msg[0]].color}}>{p.msg[1]}</div>)
}

const Chat = () => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }

    const chat = useSelector((state) => state.gameState.chat);
    const player = useSelector((state) => state.currentPlayer);
    const players = useSelector((state) => state.gameState.players)

    useEffect(() => {
        scrollToBottom()
    }, [chat]);

    return (
        <div className='chat'>
            {chat.map((x,i)=><ChatConver key={i} msg={x} player={player} players={players}/>)}
            <div ref={messagesEndRef}/>
        </div>
    )
};

export default Chat;