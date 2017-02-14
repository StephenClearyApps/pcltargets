import { handleActions } from 'redux-actions';

import * as A from './actionTypes';
import { prefix } from './logic/logic';

export interface SelectionsState {
    [groupName: string]: string;
}

export interface State {
    includeLegacyFrameworks: boolean;
    includeLegacyProfiles: boolean;
    selections: SelectionsState;
}

function select(state: State, action: A.SelectAction): State {
    return { ...state,
        selections: { ...state.selections,
            [prefix(action.payload.name)]: action.payload.selected ? action.payload.name : null
        }
    };
}

function setIncludeLegacyFrameworks(state: State, action: A.SetIncludeLegacyFrameworksAction): State {
    return { ...state,
        includeLegacyFrameworks: action.payload.value,
        selections: { }
    };
}

function setIncludeLegacyProfiles(state: State, action: A.SetIncludeLegacyProfilesAction): State {
    return { ...state,
        includeLegacyProfiles: action.payload.value
    };
}

export const reducers = (handleActions as ReduxActionsFixed.HandleActions<State>)({
    [A.Types.SELECT]: select,
    [A.Types.SET_INCLUDE_LEGACY_FRAMEWORKS]: setIncludeLegacyFrameworks,
    [A.Types.SET_INCLUDE_LEGACY_PROFILES]: setIncludeLegacyProfiles
}, {
    includeLegacyFrameworks: true,
    includeLegacyProfiles: false,
    selections: { }
});