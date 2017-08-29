import 'jest';
import * as assert from 'assert';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import thunk from 'redux-thunk';
import repatch from '../src';

describe('redux-repatch', () => {
  const ZERO = 'ZERO';
  const baseReducer = (state = 0, action) => (action.type === ZERO ? 0 : state);
  const increment = () => state => state + 1;
  const zero = () => ({ type: ZERO });

  describe('without other enhancers', () => {
    it('runs the repatch action', () => {
      const store = createStore(baseReducer, 5, compose(repatch));
      store.dispatch(increment());
      assert.strictEqual(store.getState(), 6);
    });

    it('runs the redux action', () => {
      const store = createStore(baseReducer, 5, compose(repatch));
      store.dispatch(zero());
      assert.strictEqual(store.getState(), 0);
    });
  });

  describe('with thunk', () => {
    it('runs the repatch action', () => {
      const store = createStore(baseReducer, 5, compose(repatch, applyMiddleware(thunk)));
      store.dispatch(increment());
      assert.strictEqual(store.getState(), 6);
    });

    it('runs the redux action', () => {
      const store = createStore(baseReducer, 5, compose(repatch, applyMiddleware(thunk)));
      store.dispatch(zero());
      assert.strictEqual(store.getState(), 0);
    });

    it('runs the thunk action', () => {
      const store = createStore(baseReducer, 5, compose(repatch, applyMiddleware(thunk)));
      store.dispatch(state => dispatch => dispatch(zero()));
      assert.strictEqual(store.getState(), 0);
    });
  });
});
