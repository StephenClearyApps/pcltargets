import * as _ from 'lodash';
import { handleActions } from 'redux-actions';

import * as A from './actionTypes';
import { Profile, selectedFrameworks, findAllPcls, removeSubsetPcls, netstandardVersion, alternateProfiles } from './logic/logic';
import { prefix } from './logic/extendedFramework';

export interface SelectionsState {
    [groupName: string]: string;
}

export interface ResultsState {
    netstandard: string;
    primaryTargetProfiles: Profile[];
    alternativeTargetProfiles: Profile[][];
    alternativeNugetTargets: string[];
    compatibileProfiles: Profile[];
}

export interface State {
    usesEnlightenment: boolean;
    usesVS2012: boolean;
    includeLegacyFrameworks: boolean;
    includeLegacyProfiles: boolean;
    selections: SelectionsState;
    result: ResultsState;
    numAlternativeTargetsToDisplay: number;
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

function calculateResults(usesEnlightenment: boolean, includeLegacyFrameworks: boolean, includeLegacyProfiles: boolean, selections: SelectionsState): ResultsState {
    const frameworks = selectedFrameworks(includeLegacyFrameworks, selections);
    const fullResult = findAllPcls(includeLegacyProfiles, frameworks);
    const result = removeSubsetPcls(fullResult);
    return {
        netstandard: netstandardVersion(selections),
        primaryTargetProfiles: result,
        alternativeTargetProfiles: usesEnlightenment ? _.flatMap(alternateProfiles(includeLegacyProfiles, result.length, frameworks, result), x => x) : [],
        alternativeNugetTargets: frameworks.map(y => y.nugetTarget),
        compatibileProfiles: fullResult
    };
}

function calculateSelections(includeLegacyFrameworks: boolean, currentSelections: SelectionsState): SelectionsState {
    const frameworks = selectedFrameworks(includeLegacyFrameworks, currentSelections);
    const selections = {} as SelectionsState;
    for (let f of frameworks) {
        selections[prefix(f.nugetTarget)] = f.nugetTarget;
    }
    return selections;
}

function select(state: State, action: A.SelectAction): State {
    const selections = {
        ...state.selections,
        [prefix(action.payload.name)]: action.payload.selected ? action.payload.name : null
    };
    return {
        ...state,
        selections,
        result: calculateResults(state.usesEnlightenment, state.includeLegacyFrameworks, state.includeLegacyProfiles, selections)
    };
}

function setEnlightenment(state: State, action: A.SetEnlightenmentAction): State {
    const usesEnlightenment = action.payload.value;
    const includes = calculateIncludes(usesEnlightenment, state.usesVS2012);
    const selections = calculateSelections(includes.includeLegacyFrameworks, state.selections);
    return {
        ...state,
        usesEnlightenment,
        includeLegacyFrameworks: includes.includeLegacyFrameworks,
        includeLegacyProfiles: includes.includeLegacyProfiles,
        selections,
        result: calculateResults(usesEnlightenment, includes.includeLegacyFrameworks, includes.includeLegacyProfiles, selections)
    };
}

function setVS2012(state: State, action: A.SetVS2012Action): State {
    const usesVS2012 = action.payload.value;
    const includes = calculateIncludes(state.usesEnlightenment, usesVS2012);
    const selections = calculateSelections(includes.includeLegacyFrameworks, state.selections);
    return {
        ...state,
        usesVS2012,
        includeLegacyFrameworks: includes.includeLegacyFrameworks,
        includeLegacyProfiles: includes.includeLegacyProfiles,
        selections,
        result: calculateResults(state.usesEnlightenment, includes.includeLegacyFrameworks, includes.includeLegacyProfiles, selections)
    };
}

function showAlternativeProfiles(state: State, action: A.ShowAlternativeProfilesAction): State {
    return {
        ...state,
        numAlternativeTargetsToDisplay: action.payload.numAlternativeTargetsToDisplay
    };
}

export const reducers = (handleActions as ReduxActionsFixed.HandleActions<State>)({
    [A.Types.SELECT]: select,
    [A.Types.SET_ENLIGHTENMENT]: setEnlightenment,
    [A.Types.SET_VS2012]: setVS2012,
    [A.Types.SHOW_ALTERNATIVE_PROFILES]: showAlternativeProfiles
}, {
        usesEnlightenment: false,
        usesVS2012: false,
        includeLegacyFrameworks: true,
        includeLegacyProfiles: false,
        selections: {},
        numAlternativeTargetsToDisplay: 0,
        result: {
            primaryTargetProfiles: [],
            netstandard: null,
            alternativeNugetTargets: [],
            alternativeTargetProfiles: [],
            compatibileProfiles: []
        }
    });