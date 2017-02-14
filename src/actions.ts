import { bindActionCreators } from 'redux';

import * as A from './actionTypes';
import { store } from './store';

const actionCreators = {
    select: (name: string, selected: boolean): A.SelectAction => ({ type: A.Types.SELECT, payload: { name, selected } }),
    setIncludeLegacyFrameworks: (value: boolean): A.SetIncludeLegacyFrameworksAction => ({ type: A.Types.SET_INCLUDE_LEGACY_FRAMEWORKS, payload: { value }}),
    setIncludeLegacyProfiles: (value: boolean): A.SetIncludeLegacyProfilesAction => ({ type: A.Types.SET_INCLUDE_LEGACY_PROFILES, payload: { value }})
}

export const actions = bindActionCreators(actionCreators, store.dispatch);