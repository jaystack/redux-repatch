import { Reducer, AnyAction, Middleware, applyMiddleware, Store } from 'redux';
import { Reducer as RepatchReducer } from 'repatch';

declare module 'redux' {
  export interface Dispatch<S> {
    (reducer: RepatchReducer<S>): S;
  }
}

const OVERRIDE = '@@repatch/OVERRIDE';

export const middleware: Middleware = store => next => action => {
  if (typeof action !== 'function') return next(action);
  const result = action(store.getState());
  return typeof result === 'function' ? next(result) : next({ type: OVERRIDE, state: result });
};

const extendReducer = <S>(reducer: Reducer<S>): Reducer<S> => (state: S, action: AnyAction) =>
  action.type === OVERRIDE ? action.state : reducer(state, action);

export const repatch = createStore => (reducer, preloadedState) =>
  applyMiddleware(middleware)(createStore)(extendReducer(reducer), preloadedState);

export default repatch;
