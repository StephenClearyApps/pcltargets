import { bindActionCreators } from 'redux';

import * as A from './actionTypes';
import { store } from './store';

const actionCreators = {
    setFormValue: (name: string, value: boolean): A.SetFormValueAction => ({ type: A.Types.SET_FORM_VALUE, payload: { name, value } }),
    setIncludeLegacy: (value: boolean): A.SetIncludeLegacyAction => ({ type: A.Types.SET_INCLUDE_LEGACY, payload: { value }})
}

export const actions = bindActionCreators(actionCreators, store.dispatch);