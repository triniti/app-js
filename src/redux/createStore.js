import camelCase from 'lodash/camelCase';
import { applyMiddleware, combineReducers, compose, createStore as createReduxStore } from 'redux';
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import createPbjxMiddleware from '@gdbots/pbjx/redux/createMiddleware';
import reduceReducers from '@gdbots/pbjx/redux/reduceReducers';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import logger from 'redux-logger';
import createInjectMiddleware from './createInjectMiddleware';
import { serviceIds } from '../constants';

/**
 * @param {App} app
 * @param {Bottle} bottle
 *
 * @returns {Store}
 */
export default (app, bottle) => {
  const container = app.getContainer();
  const reducers = {};
  const sagas = [];

  app.getPlugins().forEach((plugin) => {
    if (plugin.hasReducer()) {
      reducers[camelCase(plugin.getName())] = plugin.getReducer();
    }

    if (plugin.hasSaga()) {
      sagas.push(plugin.getSaga());
    }
  });

  reducers.form = formReducer;

  const pbjxReducer = container.get(pbjxServiceIds.REDUX_REDUCER);
  const rootReducer = Object.keys(reducers).length
    ? reduceReducers(combineReducers(reducers), pbjxReducer)
    : pbjxReducer;
  const middlewares = [createPbjxMiddleware(app.getPbjx()), createInjectMiddleware(container)];

  let sagaMiddleware;
  if (sagas) {
    sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);
  }

  if (!container.get('is_production')) {
    middlewares.push(logger);
  }

  // for chrome / ff extensions setup
  // eslint-disable-next-line no-underscore-dangle
  const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composer(applyMiddleware(...middlewares));
  const store = createReduxStore(rootReducer, app.getPreloadedState(), enhancer);
  bottle.factory(serviceIds.REDUX_STORE, () => store);

  if (sagaMiddleware) {
    const rootSaga = function* createRootSaga() {
      yield all(sagas.map(saga => fork(saga, container)));
    };
    sagaMiddleware.run(rootSaga);
  }

  return store;
};
