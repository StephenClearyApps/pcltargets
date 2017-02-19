import { bindActionCreators } from 'redux';

import * as A from './actionTypes';
import { store } from './store';

const actionCreators = {
    select: (name: string, selected: boolean): A.SelectAction => ({ type: A.Types.SELECT, payload: { name, selected } }),
    setEnlightenment: (value: boolean): A.SetEnlightenmentAction => ({ type: A.Types.SET_ENLIGHTENMENT, payload: { value }}),
    setVS2012: (value: boolean): A.SetVS2012Action => ({ type: A.Types.SET_VS2012, payload: { value }}),
    showAlternativeProfiles: (numAlternativeTargetsToDisplay: number): A.ShowAlternativeProfilesAction => ({ type: A.Types.SHOW_ALTERNATIVE_PROFILES, payload: { numAlternativeTargetsToDisplay } })
}

export const actions = bindActionCreators(actionCreators, store.dispatch);