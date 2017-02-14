import { PayloadAction } from './_actions';

export const Types = {
    SELECT: 'SELECT',
    SET_INCLUDE_LEGACY_FRAMEWORKS: 'SET_INCLUDE_LEGACY_FRAMEWORKS'
};

export type SelectAction = PayloadAction<{
    name: string;
    selected: boolean;
}>;

export type SetIncludeLegacyFrameworksAction = PayloadAction<{
    value: boolean;
}>;