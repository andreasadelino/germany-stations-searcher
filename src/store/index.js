import { createStore } from "redux";

function reducer(prevState = [], action) {

    if (action.type === "SAVE_STATION_SEARCH") {

        const exists = prevState.filter(station => station.primaryEvaId === action.station.primaryEvaId).length > 0;
        if (!exists) {
            prevState.push(action.station);
        }
        if (prevState.length > 5) {
            prevState.splice(0, 1);
        }
        return prevState;
    }

    return prevState;
}

const store = createStore(reducer);

export default store;