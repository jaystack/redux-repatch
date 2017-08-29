import { StoreEnhancer, Reducer, AnyAction, StoreCreator, applyMiddleware, Middleware } from 'redux';
import { Reducer as RepatchReducer } from 'repatch';

export const REPATCH = '@@repatch/NEXT_STATE';

export const middleware: Middleware = store => next => action => {
  if (typeof action !== 'function') return next(action);
  const result = action(store.getState());
  return typeof result === 'function' ? next(result) : next({ type: REPATCH, nextState: result });
};

export const extendReducer = <S>(reducer: Reducer<S>): Reducer<S> => (state: S, action: AnyAction) =>
  action.type === REPATCH ? action.nextState : reducer(state, action);

export const extendEnhancer = enhancer =>
  enhancer ? enhancer(applyMiddleware(middleware)) : applyMiddleware(middleware);

export const repatch = createStore => (reducer, preloadedState, enhancer) =>
  createStore(extendReducer(reducer), preloadedState, extendEnhancer(enhancer));
