import { applyMiddleware, compose, createStore } from 'redux';
import * as immutableState from 'redux-immutable-state-invariant';

import { reducers } from './reducers';

const middlewareEnhancer = process.env.NODE_ENV !== 'production' ? applyMiddleware(immutableState()) : undefined;
const devToolsEnhancer = (process.env.NODE_ENV !== 'production' && (window as any).devToolsExtension) ? (window as any).devToolsExtension() : undefined;
const storeEnhancer = devToolsEnhancer ? compose(middlewareEnhancer, devToolsEnhancer) : middlewareEnhancer;

const factory = storeEnhancer ? storeEnhancer(createStore) : createStore;
export const store = factory(reducers);