import 'jest';
import * as assert from 'assert';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { REPATCH, createAction, repatch } from '../src';

describe('redux-repatch', () => {
  describe('createAction', () => {
    it('returns a repatch action', () => {
      const reducer = _ => _;
      const action = createAction(reducer);
      assert.strictEqual(action.type, REPATCH);
      assert.strictEqual(action.reducer, reducer);
    });
  });

  describe('enhancer', () => {
    const ZERO = 'ZERO';
    const baseReducer = (state = 5, action) => (action.type === ZERO ? 0 : state);
    const increment = () => createAction(state => state + 1);
    const zero = () => ({ type: ZERO });

    describe('without other enhancers', () => {
      it('runs the repatch action', () => {
        const store = createStore(baseReducer, repatch as any);
        store.dispatch(increment());
        assert.strictEqual(store.getState(), 6);
      });

      it('runs the redux action', () => {
        const store = createStore(baseReducer, repatch as any);
        store.dispatch(zero());
        assert.strictEqual(store.getState(), 0);
      });
    });

    describe('with other enhancer', () => {
      const middleware: Middleware = store => next => action => next(action);
      it('runs the repatch action', () => {
        const store = createStore(baseReducer, compose(applyMiddleware(middleware), repatch as any));
        store.dispatch(increment());
        assert.strictEqual(store.getState(), 6);
      });

      it('runs the redux action', () => {
        const store = createStore(baseReducer, compose(applyMiddleware(middleware), repatch as any));
        store.dispatch(zero());
        assert.strictEqual(store.getState(), 0);
      });
    });
  });
});
