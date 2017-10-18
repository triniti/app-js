import test from 'tape';
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import App from '../src/App';

test('App tests', (t) => {
  global.APP_ENV = 'test';
  global.APP_VENDOR = 'acme';
  global.APP_NAME = 'test';
  global.APP_VERSION = 'vN.N.N';
  global.APP_BUILD = 'YYYYMMDDHHSS';
  global.APP_DEPLOYMENT_ID = 'YYYYMMDDHHSSID';
  global.APP_DEV_BRANCH = 'master';
  global.PBJX_ENDPOINT = 'https://localhost/pbjx';
  global.window = {};

  const app = new App();
  app.start();
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
  t.same(app.getPlugins(), []);

  t.end();
});
