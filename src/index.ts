import { Reducer, AnyAction, Middleware, Store, GenericStoreEnhancer, applyMiddleware } from 'redux';
import { Reducer as RepatchReducer, Thunk } from 'repatch';

declare module 'redux' {
  export interface Dispatch<S> {
    (reducer: RepatchReducer<S>): S;
    <R, E = any>(thunk: Thunk<S, E, R>): R;
  }
}

const OVERRIDE = '@@repatch/OVERRIDE';

const middleware = (extraArgument: any): Middleware => ({ dispatch, getState }) => next => action => {
  if (typeof action !== 'function') return next(action);
  const result = action(getState());
  return typeof result === 'function'
    ? result(dispatch, getState, extraArgument)
    : next({ type: OVERRIDE, state: result });
};

const extendReducer = <S>(reducer: Reducer<S>): Reducer<S> => (state: S, action: AnyAction) =>
  action.type === OVERRIDE ? action.state : reducer(state, action);

export const repatch = (extraArgument?: any): GenericStoreEnhancer => createStore => (reducer, preloadedState) =>
  applyMiddleware(middleware(extraArgument))(createStore)(extendReducer(reducer), preloadedState);

export default repatch;
