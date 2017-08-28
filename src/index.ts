import { StoreEnhancer, Reducer, AnyAction } from 'redux';
import { Reducer as RepatchReducer } from 'repatch';

export const REDUCER = '@@repatch/REDUCER';

const extendReducer = <S>(reducer: Reducer<S>): Reducer<S> => (state: S, action: AnyAction) =>
  action.type === REDUCER ? action.reducer(state) : reducer(state, action);

export const repatch = <S>(createStore) => (reducer, preloadedState, enhancer) =>
  createStore(extendReducer(reducer), preloadedState, enhancer) as StoreEnhancer<S>;

export const createAction = <S>(reducer: RepatchReducer<S>): AnyAction => {
  if (typeof reducer !== 'function') throw new Error('Reducer is not a function');
  return { type: REDUCER, reducer };
};
