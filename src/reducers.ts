import { handleActions } from 'redux-actions';

import * as A from './actionTypes';
import { prefix } from './logic/logic';

export interface SelectionsState {
    [groupName: string]: string;
}

export interface State {
    includeLegacy: boolean;
    selections: SelectionsState;
}

function select(state: State, action: A.SelectAction): State {
    return { ...state,
        selections: { ...state.selections,
            [prefix(action.payload.name)]: action.payload.selected ? action.payload.name : null
        }
    };
}

function setIncludeLegacy(state: State, action: A.SetIncludeLegacyAction): State {
    return { ...state,
        includeLegacy: action.payload.value,
        selections: { }
    };
}

export const reducers = (handleActions as ReduxActionsFixed.HandleActions<State>)({
    [A.Types.SELECT]: select,
    [A.Types.SET_INCLUDE_LEGACY]: setIncludeLegacy
}, {
    includeLegacy: true,
    selections: { }
});