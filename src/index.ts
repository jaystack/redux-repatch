import { StoreEnhancer, Reducer, AnyAction, StoreCreator, GenericStoreEnhancer, Store } from 'redux';
import { Reducer as RepatchReducer } from 'repatch';

export const REDUCER = '@@repatch/REDUCER';

const extendReducer = <S>(reducer: Reducer<S>): Reducer<S> => (state: S, action: AnyAction) =>
  action.type === REDUCER ? action.reducer(state) : reducer(state, action);

export const repatch: GenericStoreEnhancer = createStore => (reducer, preloadedState) =>
  createStore(extendReducer(reducer), preloadedState);

export const createAction = <S = any>(reducer: RepatchReducer<S>): AnyAction => {
  if (typeof reducer !== 'function') throw new Error('Reducer is not a function');
  return { type: REDUCER, reducer };
};
