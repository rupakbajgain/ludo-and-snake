import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux'
import storeR from './store'

import io from 'socket.io-client';

function loadState(){
  fetch('/gameState')
  .then(res=>res.json())
  .then(res=>{
    store.dispatch({type: 'SET_STATE', state: res});
  });
};

const socket = io.connect({reconnect: true});
const store=storeR(socket);
const currentPlayer = store.getState().currentPlayer;
//console.log(currentPlayer);

socket.on("connect", function(){
  console.log("Connected");
  socket.emit('PLAYER_CONNECTED', {id: currentPlayer});
  loadState();
  socket.on("disconnect", function(){
    store.dispatch({type: 'DISCONNECTED'});
  })
  socket.on("PLAYER_CONNECTED", function(x){
    store.dispatch({type: 'PLAYER_CONNECTED', x});
  })
  socket.on("PLAYER_DISCONNECTED", function(x){
    store.dispatch({type: 'PLAYER_DISCONNECTED', x});
  })
  socket.on("MESSAGE", function(x){
    store.dispatch({type: 'MESSAGE', x});
  })
  socket.on("COLOR", function(x){
    store.dispatch({type: 'COLOR', x});
  })
  socket.on("SET_LOCKED", function(x){
    store.dispatch({type: 'SET_LOCKED', x});
  })
  socket.on("GAME_STATUS", function(x){
    store.dispatch({type: 'GAME_STATUS', x});
  })
  socket.on("DICEROLL", function(x){
    store.dispatch({type: 'DICEROLL', x});
  })
  socket.on("REQ_DICEROLL", function(x){
    store.dispatch({type: 'REQ_DICEROLL', x});
  })
  socket.on("NOTIFY", function(x){
    store.dispatch({type: 'NOTIFY', x});
  })
  socket.on("UPDATE_BOARD", function(x){
    store.dispatch({type: 'UPDATE_BOARD', x});
  })
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();