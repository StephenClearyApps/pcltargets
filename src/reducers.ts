import { handleActions } from 'redux-actions';

import * as A from './actionTypes';
import { prefix, selectedFrameworks } from './logic/logic';

export interface SelectionsState {
    [groupName: string]: string;
}

export interface State {
    usesEnlightenment: boolean;
    usesVS2012: boolean;
    includeLegacyFrameworks: boolean;
    includeLegacyProfiles: boolean;
    selections: SelectionsState;
}

function calculateIncludes(usesEnlightenment: boolean, usesVS2012: boolean): { includeLegacyFrameworks: boolean; includeLegacyProfiles: boolean; } {
    if (usesVS2012) {
        return {
            includeLegacyFrameworks: true,
            includeLegacyProfiles: true
        };
    }
    if (usesEnlightenment) {
        return {
            includeLegacyFrameworks: false,
            includeLegacyProfiles: false
        };
    }
    return {
        includeLegacyFrameworks: true,
        includeLegacyProfiles: false
    };
}

function select(state: State, action: A.SelectAction): State {
    return { ...state,
        selections: { ...state.selections,
            [prefix(action.payload.name)]: action.payload.selected ? action.payload.name : null
        }
    };
}

function setEnlightenment(state: State, action: A.SetEnlightenmentAction): State {
    const includes = calculateIncludes(action.payload.value, state.usesVS2012);
    const frameworks = selectedFrameworks(includes.includeLegacyFrameworks, state.selections);
    const selections = { } as SelectionsState;
    for (let f of frameworks) {
        selections[prefix(f.nugetTarget)] = f.nugetTarget;
    }

    return { ...state,
        usesEnlightenment: action.payload.value,
        includeLegacyFrameworks: includes.includeLegacyFrameworks,
        includeLegacyProfiles: includes.includeLegacyProfiles,
        selections: selections
    };
}

function setVS2012(state: State, action: A.SetVS2012Action): State {
    const includes = calculateIncludes(state.usesEnlightenment, action.payload.value);
    const frameworks = selectedFrameworks(includes.includeLegacyFrameworks, state.selections);
    const selections = { } as SelectionsState;
    for (let f of frameworks) {
        selections[prefix(f.nugetTarget)] = f.nugetTarget;
    }

    return { ...state,
        usesVS2012: action.payload.value,
        includeLegacyFrameworks: includes.includeLegacyFrameworks,
        includeLegacyProfiles: includes.includeLegacyProfiles,
        selections: selections
    };
}

export const reducers = (handleActions as ReduxActionsFixed.HandleActions<State>)({
    [A.Types.SELECT]: select,
    [A.Types.SET_ENLIGHTENMENT]: setEnlightenment,
    [A.Types.SET_VS2012]: setVS2012
}, {
    usesEnlightenment: false,
    usesVS2012: false,
    includeLegacyFrameworks: true,
    includeLegacyProfiles: false,
    selections: { }
});