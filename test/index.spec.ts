import 'jest';
import * as assert from 'assert';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import repatch from '../src';

describe('redux-repatch', () => {
  const ZERO = 'ZERO';
  const baseReducer = (state = 0, action) => (action.type === ZERO ? 0 : state);
  const increment = () => state => state + 1;
  const zero = () => ({ type: ZERO });

  describe('without other enhancers', () => {
    it('runs the repatch action', () => {
      const store = createStore(baseReducer, 5, repatch());
      store.dispatch(increment());
      assert.strictEqual(store.getState(), 6);
    });

    it('runs the redux action', () => {
      const store = createStore(baseReducer, 5, repatch());
      store.dispatch(zero());
      assert.strictEqual(store.getState(), 0);
    });

    it('runs redux action via thunk action', () => {
      const store = createStore(baseReducer, 5, repatch());
      store.dispatch(state => dispatch => dispatch(zero()));
      assert.strictEqual(store.getState(), 0);
    });

    it('runs repatch action via thunk action', () => {
      const store = createStore(baseReducer, 5, repatch());
      store.dispatch(state => dispatch => dispatch(increment()));
      assert.strictEqual(store.getState(), 6);
    });
  });

  describe('with other enhancers', () => {
    const middleware = store => next => action => next(action);

    describe('to left', () => {
      it('runs the repatch action', () => {
        const store = createStore(baseReducer, 5, compose(repatch() as any, applyMiddleware(middleware)));
        store.dispatch(increment());
        assert.strictEqual(store.getState(), 6);
      });

      it('runs the redux action', () => {
        const store = createStore(baseReducer, 5, compose(repatch() as any, applyMiddleware(middleware)));
        store.dispatch(zero());
        assert.strictEqual(store.getState(), 0);
      });

      it('runs redux action via thunk action', () => {
        const store = createStore(baseReducer, 5, compose(repatch() as any, applyMiddleware(middleware)));
        store.dispatch(state => dispatch => dispatch(zero()));
        assert.strictEqual(store.getState(), 0);
      });

      it('runs repatch action via thunk action', () => {
        const store = createStore(baseReducer, 5, compose(repatch() as any, applyMiddleware(middleware)));
        store.dispatch(state => dispatch => dispatch(increment()));
        assert.strictEqual(store.getState(), 6);
      });
    });

    describe('to right', () => {
      it('runs the repatch action', () => {
        const store = createStore(baseReducer, 5, compose(applyMiddleware(middleware), repatch() as any));
        store.dispatch(increment());
        assert.strictEqual(store.getState(), 6);
      });

      it('runs the redux action', () => {
        const store = createStore(baseReducer, 5, compose(applyMiddleware(middleware), repatch() as any));
        store.dispatch(zero());
        assert.strictEqual(store.getState(), 0);
      });

      it('runs redux action via thunk action', () => {
        const store = createStore(baseReducer, 5, compose(applyMiddleware(middleware), repatch() as any));
        store.dispatch(state => dispatch => dispatch(zero()));
        assert.strictEqual(store.getState(), 0);
      });

      it('runs repatch action via thunk action', () => {
        const store = createStore(baseReducer, 5, compose(applyMiddleware(middleware), repatch() as any));
        store.dispatch(state => dispatch => dispatch(increment()));
        assert.strictEqual(store.getState(), 6);
      });
    });
  });
});
