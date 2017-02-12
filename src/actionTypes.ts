import { PayloadAction } from './_actions';

export const Types = {
    SET_FORM_VALUE: 'SET_FORM_VALUE',
    SET_INCLUDE_LEGACY: 'SET_INCLUDE_LEGACY'
};

export type SetFormValueAction = PayloadAction<{
    name: string;
    value: boolean;
}>;

export type SetIncludeLegacyAction = PayloadAction<{
    value: boolean;
}>;