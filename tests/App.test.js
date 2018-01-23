/* globals global */
import test from 'tape';
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import { actionTypes } from '../src/constants';
import { App, getInstance, hasInstance, setInstance } from '../src';
import TestPlugin from './fixtures/TestPlugin';

/**
 * @returns {App}
 */
const createApp = () => {
  global.APP_BASE_URL = '/';
  global.APP_BUILD = 'YYYYMMDDHHSS';
  global.APP_ENV = 'test';
  global.APP_DEPLOYMENT_ID = 'YYYYMMDDHHSSID';
  global.APP_DEV_BRANCH = 'master';
  global.APP_NAME = 'test';
  global.APP_VENDOR = 'acme';
  global.APP_VERSION = 'vN.N.N';
  global.PBJX_ENDPOINT = 'https://localhost/pbjx';
  global.window = {};

  const testPlugin = new TestPlugin();
  const app = new App([testPlugin], { test: { lastAction: null } });
  app.start();
  testPlugin.start(app);
  return app;
};


test('App tests', (t) => {
  const app = createApp();
  const testPlugin = app.getPlugins().pop();
  const container = app.getContainer();

  t.true(app instanceof App);
  t.same(container.get('app_env'), global.APP_ENV);
  t.same(container.get('app_vendor'), global.APP_VENDOR);
  t.same(container.get('app_name'), global.APP_NAME);
  t.same(container.get('app_version'), global.APP_VERSION);
  t.same(container.get('app_build'), global.APP_BUILD);
  t.same(container.get('app_deployment_id'), global.APP_DEPLOYMENT_ID);
  t.same(container.get('app_dev_branch'), global.APP_DEV_BRANCH);
  t.same(container.get(pbjxServiceIds.TRANSPORT_HTTP_ENDPOINT), global.PBJX_ENDPOINT);
  t.false(app.hasPlugin('invalid'));
  t.true(app.hasPlugin('test'));
  t.same(
    app.getStore().getState(),
    {
      test: { lastAction: actionTypes.APP_STARTED },
      form: {},
    },
    'Redux state should match.',
  );
  t.same(app.getPlugins(), [testPlugin]);

  t.end();
});


test('App dispatcher tests', (t) => {
  const app = createApp();
  const dispatcher = app.getDispatcher();
  const testPlugin = app.getPlugins().pop();

  t.same(testPlugin.called, 1, 'TestPlugin start event listener should be called.');

  let listenerCalled = 0;
  const listener = () => listenerCalled += 1; // eslint-disable-line
  dispatcher.addListener('test', listener);
  dispatcher.addListener('test', listener); // intentionally registered twice
  dispatcher.dispatch('test');
  t.same(listenerCalled, 1, 'Listener should be called once.');

  listenerCalled = 0;
  dispatcher.removeListener('test', listener);
  t.same(listenerCalled, 0, 'Listener should not be called.');

  t.end();
});


test('App interceptor tests', (t) => {
  const app = createApp();
  const testPlugin = app.getPlugins().pop();
  testPlugin.called = 0;

  const action = { type: 'interceptor' };
  const store = app.getStore();

  store.dispatch(action);
  t.same(testPlugin.called, 1, 'TestPlugin event listener should be called.');
  t.same(
    app.getStore().getState().test,
    { lastAction: 'interceptor' },
    'Redux state should match.',
  );

  const interceptedAction = testPlugin.interceptorEvent.getAction();
  t.same(interceptedAction, action, 'Intercepted event action should match.');
  t.true(interceptedAction.worked, 'Intercepted action should have worked key that is true.');

  t.end();
});


test('App global instance tests', (t) => {
  const app = createApp();

  t.false(hasInstance(), 'hasInstance should be false.');
  setInstance(app);
  t.true(hasInstance(), 'hasInstance should be true.');
  t.same(getInstance(), app, 'app instance should be the same');
  setInstance(null);
  t.false(hasInstance(), 'hasInstance should be false again.');

  t.end();
});
