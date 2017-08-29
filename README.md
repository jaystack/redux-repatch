# redux-repatch

Redux enhancer for dispatching reducers

[Repatch](https://www.npmjs.com/package/repatch) is just a simplfied [Redux](https://www.npmjs.com/package/redux), that let you create actions more briefly by dispatching reducers directly. However if you would like to use [redux]((https://www.npmjs.com/package/redux)) with this feature, you need this package.

## Installation

```
npm install --save redux-repatch
```

## How to use

`redux-repatch` provides a store enhancer, that is usable at creating the store. This enhancer ensures that you can use regular actions and repatch actions together:

```javascript
import { createStore } from 'redux'
import repatch from 'redux-repatch'

const reducer = (state = 0, action) {
  switch (action.type) {
    'SET_TO_VALUE': return action.value
    default: state
  }
}

const store = createStore(reducer, repatch())

const setToValue = value => ({ type: 'SET_TO_VALUE', value }) // redux action
const increment = value => state => state + value // repatch action

store.dispatch(setToValue(42)) // 42
store.dispatch(increment(10)) // 52
```

### Use with other enhancers

```javascript
import { createStore, applyMiddlewares, compose } from 'redux'
import repatch from 'redux-repatch'

const store = createStore(
  reducer,
  compose(
    applyMiddlewares(myMiddleware),
    repatch()
  )
)
```

### Use with [redux-thunk](https://www.npmjs.com/package/redux-thunk)

We cannot use `repatch` actions and `thunk` actions together, because both of actions are defined as functions. Therefore `redux-repatch` provides a builtin `thunk` mechanism.
The original [repatch](https://www.npmjs.com/package/repatch) library shares its own `thunk` middleware, that's using is optional. `redux-repatch` does it automatically.
In the `repatch` terminology `thunk` reducer is a function, that returns a function. We call this function as the `delegate`.

```javascript
const waitAndIncrement = time => state => async (dispatch, getState) => {
  await sleep(time);
  dispatch(increment(10))
}

store.dispatch(waitAndIncrement(3000))
```

#### Adding extraArgument

```javascript
import { createStore } from 'redux'
import repatch from 'redux-repatch'
import api from './api'
import { hashHistory } from 'react-router';

const store = createStore(reducer, repatch({ api, hashHistory }))

const updateUser = delta => state =>
  async (dispatch, getState, { api, hashHistory }) => {
    // ...
  }
```

## How it works

The `repatch` enhancer extends your reducer by handling a special action type, and enhances the `store` with a middleware. This middleware handles the function-like actions. The `thunk` actions will fired in the middleware and they returned value will be returned. The regular `repatch` reducers will be transformed to regular `redux` action objects with the previously mentioned special action type. Then the extended reducer can handle it.

## Import in CommonJS

```javascript
const repatch = require('redux-repatch').repatch
```

or

```javascript
const repatch = require('redux-repatch').default
```

## Bundles

```html
<script src="https://unpkg.com/redux-repatch/dist/redux-repatch.js"></script>
```

or the minified bundle:

```html
<script src="https://unpkg.com/redux-repatch/dist/redux-repatch.min.js"></script>
```

then

```javascript
const repatch = ReduxRepatch.repatch
```

---

## License

[MIT](https://spdx.org/licenses/MIT)

## Community

[https://twitter.com/repatchjs](https://twitter.com/repatchjs)

## Developed by

[![JayStack](http://jaystack.com/wp-content/uploads/2017/08/jaystack_logo_transparent_50.png)](http://jaystack.com/)
