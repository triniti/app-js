/* globals
  APP_ENV,
  APP_VENDOR,
  APP_NAME,
  APP_VERSION,
  APP_BUILD,
  APP_DEPLOYMENT_ID,
  APP_DEV_BRANCH
*/
/* eslint-disable no-unused-vars, class-methods-use-this, max-len */
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import Dispatcher from '@gdbots/pbjx/Dispatcher';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import Bottle from 'bottlejs';
import Container from './Container';
import LogicException from './exceptions/LogicException';
import configurePbjx from './pbjx/configurePbjx';
import createStore from './redux/createStore';
import { actionTypes, serviceIds } from './constants';

const instances = new WeakMap();

export default class App extends EventSubscriber {
  /**
   * @param {Plugin[]} plugins
   * @param {Object}   preloadedState
   * @param {Function} pbjxConfigurator - Function signature (app, bottle)
   * @param {Function} storeCreator - Function signature (app, bottle), returns a reduxStore
   */
  constructor(plugins = [], preloadedState = {}, pbjxConfigurator = configurePbjx, storeCreator = createStore) {
    super();
    const instance = {
      bottle: new Bottle(),
      container: null,
      dispatcher: new Dispatcher(),
      plugins: new Map(),
      preloadedState,
      pbjxConfigurator,
      storeCreator,
      store: null,
      routes: {},
      running: false,
    };

    instances.set(this, instance);
    instance.container = new Container(instance.bottle);

    /*
     * Constants should NEVER change and cannot be decorated.
     * Most environment variables are copied here to make them
     * injectable and used as a standard method of access.
     */
    const appEnv = APP_ENV || 'dev';
    instance.bottle.constant('app_env', appEnv);
    instance.bottle.constant('app_vendor', APP_VENDOR);
    instance.bottle.constant('app_name', APP_NAME);
    instance.bottle.constant('app_version', APP_VERSION);
    instance.bottle.constant('app_build', APP_BUILD);
    instance.bottle.constant('app_deployment_id', APP_DEPLOYMENT_ID);
    instance.bottle.constant('app_dev_branch', APP_DEV_BRANCH);
    instance.bottle.constant(`is_${appEnv}_environment`, true);
    instance.bottle.constant('is_production', appEnv === 'prod' || appEnv === 'production');
    instance.bottle.constant('is_not_production', !instance.bottle.container.is_production);

    instance.bottle.factory(serviceIds.INSTANCE, () => this);
    instance.bottle.factory(serviceIds.CONTAINER, () => instance.container);
    instance.bottle.factory(serviceIds.DISPATCHER, () => instance.dispatcher);

    instance.dispatcher.addSubscriber(this);
    plugins.forEach((plugin) => {
      instance.plugins.set(plugin.getName(), plugin);
      instance.dispatcher.addSubscriber(plugin);
    });
  }

  /**
   * Returns the container with access to all services
   * and parameters for this app instance.
   *
   * @returns {Container}
   */
  getContainer() {
    return instances.get(this).container;
  }

  /**
   * @returns {Dispatcher}
   */
  getDispatcher() {
    return instances.get(this).dispatcher;
  }

  /**
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
    const instance = instances.get(this);
    if (!instance.running) {
      throw new LogicException('The app store has not been created yet.');
    }

    return instance.store;
  }

  /**
   * Returns all of the routes for this app instance.
   * (Aggregated from all plugins)
   *
   * @returns {Object}
   */
  getRoutes() {
    return instances.get(this).routes;
  }

  /**
   * @param {string} pluginName
   *
   * @returns {boolean}
   */
  hasPlugin(pluginName) {
    return instances.get(this).plugins.has(pluginName);
  }

  /**
   * @returns {Plugin[]}
   */
  getPlugins() {
    return Array.from(instances.get(this).plugins.values());
  }

  /**
   * @param {Bottle} bottle
   */
  configure(bottle) {
    // override in concrete app if you need to customize the container
  }

  /**
   * Runs the "start" routine on the app:
   *
   * - configures pbjx services using pbjxConfigurator
   * - configures all plugins
   *   - calls "configure" on the plugin instance
   *   - merges routes from plugin to app
   * - calls "configure" on the app instance
   * - creates the store using the storeCreator
   * - dispatches the "APP_STARTED" redux action
   *
   * Calling "start" when the app is already running is a noop.
   *
   * @returns {App}
   */
  start() {
    const instance = instances.get(this);
    if (instance.running) {
      return this;
    }

    // todo: wrap the provided bottle so we can make it immutable after configure
    instance.pbjxConfigurator(this, instance.bottle);
    instance.plugins.forEach((plugin) => {
      plugin.configure(this, instance.bottle);
      instance.routes = Object.assign(instance.routes, plugin.getRoutes());
    });

    this.configure(instance.bottle);
    instance.store = instance.storeCreator(this, instance.bottle, instance.preloadedState);
    instance.running = true;
    instance.store.dispatch({ type: actionTypes.APP_STARTED });

    return this;
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    const instance = instances.get(this);
    return {
      plugins: this.getPlugins().map(String),
      container: instance.bottle.container.$list(),
    };
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.getPlugins().map(String).join('\n');
  }
}
