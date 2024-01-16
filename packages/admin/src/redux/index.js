import { compose, createStore, applyMiddleware } from 'redux'

import rootReducer from './rootReducers'

const configureStore = (initialState = {}) => {
    const store = createStore(rootReducer, initialState,)

    // if (module.hot && process.env.NODE_ENV !== 'production') {
    //   // Enable Webpack hot module replacement for reducers
    //   module.hot.accept('./rootReducers', () => {
    //     console.log('replacing reducer...')
    //     const nextRootReducer = require('./rootReducers').default
    //     store.replaceReducer(nextRootReducer)
    //   })
    // }

    return store
}

export default configureStore()