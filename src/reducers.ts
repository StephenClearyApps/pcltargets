import { handleActions } from 'redux-actions';
import * as A from './actionTypes';

export interface State {
    includeLegacy: boolean;
    form: {
        [name: string]: boolean;
    }
}

function setFormValue(state: State, action: A.SetFormValueAction): State {
    return { ...state,
        form: { ...state.form,
            [action.payload.name]: action.payload.value
        }
    };
}

function setIncludeLegacy(state: State, action: A.SetIncludeLegacyAction): State {
    return { ...state,
        includeLegacy: action.payload.value
    };
}

export const reducers = (handleActions as ReduxActionsFixed.HandleActions<State>)({
    [A.Types.SET_FORM_VALUE]: setFormValue,
    [A.Types.SET_INCLUDE_LEGACY]: setIncludeLegacy
}, {
    includeLegacy: true,
    form: {}
});