import { PayloadAction } from './_actions';

export const Types = {
    SELECT: 'SELECT',
    SET_INCLUDE_LEGACY_FRAMEWORKS: 'SET_INCLUDE_LEGACY_FRAMEWORKS',
    SET_INCLUDE_LEGACY_PROFILES: 'SET_INCLUDE_LEGACY_PROFILES'
};

export type SelectAction = PayloadAction<{
    name: string;
    selected: boolean;
}>;

export type SetIncludeLegacyFrameworksAction = PayloadAction<{
    value: boolean;
}>;

export type SetIncludeLegacyProfilesAction = PayloadAction<{
    value: boolean;
}>;