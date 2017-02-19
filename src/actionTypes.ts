import { Action, PayloadAction } from './_actions';

export const Types = {
    SELECT: 'SELECT',
    SET_ENLIGHTENMENT: 'SET_ENLIGHTENMENT',
    SET_VS2012: 'SET_VS2012',
    SHOW_ALTERNATIVE_PROFILES: 'SHOW_ALTERNATIVE_PROFILES'
};

export type SelectAction = PayloadAction<{
    name: string;
    selected: boolean;
}>;

export type SetEnlightenmentAction = PayloadAction<{
    value: boolean;
}>;

export type SetVS2012Action = PayloadAction<{
    value: boolean;
}>;

export type ShowAlternativeProfilesAction = PayloadAction<{
    numAlternativeTargetsToDisplay: number;
}>;