export interface Action {
    type: string;
}

export interface ActionPayload<TPayload> {
    payload: TPayload;
}

export interface ActionError {
    error: boolean;
}

export interface ActionMeta<TMeta> {
    meta: TMeta;
}

export type PayloadAction<TPayload> = Action & ActionPayload<TPayload>;
export type ErrorAction = Action & ActionError & ActionPayload<Error>;
export type MetaAction<TMeta> = Action & ActionMeta<TMeta>;
export type MetaPayloadAction<TMeta, TPayload> = Action & ActionPayload<TPayload> & ActionMeta<TMeta>;
export type MetaErrorAction<TMeta> = Action & ActionError & ActionPayload<Error> & ActionMeta<TMeta>;