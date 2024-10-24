function getId(){
    if(!localStorage.getItem('my_number'))
        return 0;
    return 1;
};

const initialState = {
    isStateLoaded: false,
    gameState: {},
    currentPlayer: getId()
};

const stateReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'MESSAGE':
        return {
            ...state,
            gameState: {...state.gameState, chat: [...state.gameState.chat, action.x]}
        }
      case 'GAME_STATUS':
        {
        let players=state.gameState.players;
        if (action.x=='WAITING'){
            players=players.map(x=>{return {...x, locked: false}})
        }
            return {
                ...state,
                gameState: {...state.gameState, players: players, gameStatus: action.x}
            }
        }
      case 'NOTIFY':
        return {
            ...state,
            gameState: {...state.gameState, gameMessage: action.x}
        }
      case 'UPDATE_BOARD':
                return {
                    ...state,
                    gameState: {...state.gameState, board: action.x}
                }        
      case 'DICEROLL':
            return {
                ...state,
                gameState: {...state.gameState, rollDice: false, diceValue: action.x.value}
            }
      case 'REQ_DICEROLL':
            return {
                ...state,
                gameState: {...state.gameState, rollDice: true, currentPlayer: action.x.cplayer}
            }    
        case 'COLOR':
        {
        let players = [...state.gameState.players];
        players[action.x.id]={...players[action.x.id], color: action.x.color};
        return {
            ...state,
            gameState: {...state.gameState, players}
        }
        }
      case 'SET_LOCKED':
        {
            let players = [...state.gameState.players];
            players[action.x.id]={...players[action.x.id], locked: action.x.locked};
            return {
                ...state,
                gameState: {...state.gameState, players}
            }    
        }
      case 'SET_STATE':
        return {
            ...state,
            isStateLoaded: true,
            gameState: action.state
        };
      case 'DISCONNECTED':
        return {
            ...state,
            isStateLoaded: false
        }
        case 'PLAYER_CONNECTED':
            {
                if(!state.isStateLoaded)return state;
        let players = [...state.gameState.players];
        players[action.x.id]={...players[action.x.id], online: players[action.x.id].online+1};
        console.log(state.gameState.players,players);
        return {
            ...state,
            gameState: {...state.gameState, players}
        }
            }
        case 'PLAYER_DISCONNECTED':
            {
                if(!state.isStateLoaded)return state;
        let players = [...state.gameState.players];
        console.log(state.gameState.players,players);
        //console.log(players,action);
        players[action.x.id]={...players[action.x.id], online: players[action.x.id].online-1};
        return {
            ...state,
            gameState: {...state.gameState, players}
        }
            }
        default:
        return state;
    }
};

export default stateReducer;