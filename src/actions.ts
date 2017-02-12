import { bindActionCreators } from 'redux';

import * as A from './actionTypes';
import { store } from './store';

const actionCreators = {
    select: (name: string, selected: boolean): A.SelectAction => ({ type: A.Types.SELECT, payload: { name, selected } }),
    setIncludeLegacy: (value: boolean): A.SetIncludeLegacyAction => ({ type: A.Types.SET_INCLUDE_LEGACY, payload: { value }})
}

export const actions = bindActionCreators(actionCreators, store.dispatch);