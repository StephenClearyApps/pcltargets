import { PayloadAction } from './_actions';

export const Types = {
    SELECT: 'SELECT',
    SET_INCLUDE_LEGACY: 'SET_INCLUDE_LEGACY'
};

export type SelectAction = PayloadAction<{
    name: string;
    selected: boolean;
}>;

export type SetIncludeLegacyAction = PayloadAction<{
    value: boolean;
}>;