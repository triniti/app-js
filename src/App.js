/* globals
  APP_ENV,
  APP_VENDOR,
  APP_NAME,
  APP_VERSION,
  APP_BUILD,
  APP_DEPLOYMENT_ID,
  APP_DEV_BRANCH
*/
/* eslint-disable no-unused-vars, class-methods-use-this */
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import Bottle from 'bottlejs';
import Container from './Container';
import LogicException from './exceptions/LogicException';
import configurePbjx from './pbjx/configurePbjx';
import createStore from './redux/createStore';
import { serviceIds } from './constants';
import actions from './actions';

const privateProps = new WeakMap();

export default class App {
  /**
   * @param {Plugin[]} plugins
   * @param {Object}   preloadedState
   * @param {Function} pbjxConfigurator - Function signature (app, bottle)
   * @param {Function} storeCreator - Function signature (app, bottle), returns a reduxStore
   */
  constructor(
    plugins = [],
    preloadedState = {},
    pbjxConfigurator = configurePbjx,
    storeCreator = createStore,
  ) {
    const app = {
      bottle: new Bottle(),
      container: null,
      plugins: new Map(),
      preloadedState,
      pbjxConfigurator,
      storeCreator,
      store: null,
      routes: {},
      running: false,
    };

    plugins.map(plugin => app.plugins.set(plugin.getName(), plugin));

    /*
     * Constants should NEVER change and cannot be decorated.
     * Most environment variables are copied here to make them
     * injectable and used as a standard method of access.
     */
    const appEnv = APP_ENV || 'dev';
    app.bottle.constant('app_env', appEnv);
    app.bottle.constant('app_vendor', APP_VENDOR);
    app.bottle.constant('app_name', APP_NAME);
    app.bottle.constant('app_version', APP_VERSION);
    app.bottle.constant('app_build', APP_BUILD);
    app.bottle.constant('app_deployment_id', APP_DEPLOYMENT_ID);
    app.bottle.constant('app_dev_branch', APP_DEV_BRANCH);
    app.bottle.constant(`is_${appEnv}_environment`, true);
    app.bottle.constant('is_production', appEnv === 'prod' || appEnv === 'production');
    app.bottle.constant('is_not_production', !app.bottle.container.is_production);

    app.bottle.factory(serviceIds.APP, () => this);
    app.bottle.factory(serviceIds.CONTAINER, () => this.getContainer());

    privateProps.set(this, app);
  }

  /**
   * Returns the container will access to all services
   * and parameters for this app instance.
   *
   * @returns {Container}
   */
  getContainer() {
    const app = privateProps.get(this);

    if (!app.container) {
      app.container = new Container(app.bottle);
    }

    return app.container;
  }

  /**
   * Runs the "start" routine on the app:
   *
   * - configures pbjx services using pbjxConfigurator
   * - calls "configure" on all plugins
   * - calls "configure" on the app instance
   * - creates the store using the storeCreator
   * - calls "start" on all plugins
   * - aggregates all routes from all plugins to this instance.
   *
   * Calling "start" when the app is already running is a noop.
   *
   * @returns {App}
   */
  start() {
    const app = privateProps.get(this);
    if (app.running) {
      return this;
    }

    // todo: wrap the provided bottle so we can make it immutable after configure
    app.pbjxConfigurator(this, app.bottle);
    app.plugins.forEach(plugin => plugin.configure(this, app.bottle));
    this.configure(app.bottle);
    app.store = app.storeCreator(this, app.bottle);
    app.running = true;

    app.plugins.forEach((plugin) => {
      plugin.start(this);
      app.routes = Object.assign(app.routes, plugin.getRoutes());
    });

    app.store.dispatch(actions.startApp());

    return this;
  }

  /**
   * Stops the app, resets the container, clears routes and
   * dumps the current state to the preloadedState.
   *
   * @returns {App}
   */
  stop() {
    const app = privateProps.get(this);
    if (!app.running) {
      return this;
    }

    app.plugins.forEach(plugin => plugin.stop(this));
    app.preloadedState = app.store.getState();
    app.store.dispatch(actions.stopApp());
    app.store = null;
    app.bottle.resetProviders();
    app.routes = {};
    app.running = false;

    return this;
  }

  /**
   * Returns the preloaded state the app was instantiated with.
   *
   * @returns {Object}
   */
  getPreloadedState() {
    return privateProps.get(this).preloadedState || {};
  }

  /**
   * Returns the app (Pbjx) service.
   *
   * @returns {Pbjx}
   */
  getPbjx() {
    return this.getContainer().get(pbjxServiceIds.PBJX);
  }

  /**
   * Returns the app (Redux) store.
   *
   * @returns {Object}
   *
   * @throws {LogicException}
   */
  getStore() {
    const app = privateProps.get(this);
    if (!app.running) {
      throw new LogicException('The app store has not been created yet.');
    }

    return app.store;
  }

  /**
   * Returns all of the routes for this app instance.
   * (Aggregated from all plugins)
   *
   * @returns {Object}
   */
  getRoutes() {
    return privateProps.get(this).routes;
  }

  /**
   * @param {string} pluginName
   *
   * @returns {boolean}
   */
  hasPlugin(pluginName) {
    return privateProps.get(this).plugins.has(pluginName);
  }

  /**
   * @param {Plugin} plugin
   *
   * @returns {App}
   *
   * @throws {LogicException}
   */
  addPlugin(plugin) {
    const app = privateProps.get(this);
    if (app.running) {
      throw new LogicException('App is already running.  No more plugins can be added.');
    }

    app.plugins.set(plugin.getName(), plugin);
    return this;
  }

  /**
   * @returns {Plugin[]}
   */
  getPlugins() {
    return Array.from(privateProps.get(this).plugins.values());
  }

  /**
   * @param {Bottle} bottle
   */
  configure(bottle) {
    // override in concrete app if you need to customize the container
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    const app = privateProps.get(this);
    return {
      plugins: this.getPlugins().map(String),
      container: app.bottle.container.$list(),
    };
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.getPlugins().map(String).join('\n');
  }
}
