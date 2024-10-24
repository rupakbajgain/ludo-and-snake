import { applyMiddleware, createStore } from "redux";
import stateReducer from "./reducers/stateReducer";

const SocketMiddleware = socket=> store => next => async action => {
    if (!action.emit) {
      next(action);
      return;
    }
    socket.emit(action.emit, action.x);
  };

function store(socket){
    const x = createStore(stateReducer,undefined,applyMiddleware(SocketMiddleware(socket)));
    return x;
}

export default store;