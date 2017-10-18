/* eslint-disable no-unused-vars, class-methods-use-this */
export default class Plugin {
  /**
   * @param {string} vendor
   * @param {string} name
   * @param {string} version
   */
  constructor(vendor, name, version) {
    Object.defineProperty(this, 'vendor', { value: vendor });
    Object.defineProperty(this, 'name', { value: name });
    Object.defineProperty(this, 'version', { value: version });

    /**
     * A routes object with structure:
     * routeName: routeObject{}
     *
     * @example route
     *  '@triniti/iam/list_roles': {
     *    path: '/iam/roles',
     *    component: ListAllRolesScreen,
     *    exact: true, // optional, default: true
     *    strict: false, // optional, default: false
     *    public: false, // optional, default: false
     *  },
     *
     * @example redirect
     * '@triniti/iam/index': {
     *    path: '/iam',
     *    redirect: {
     *      to: '/iam/users',
     *    },
     *    exact: true, // optional, default: true
     *  },
     *
     * @type {Object}
     */
    this.routes = {};

    /**
     * @link http://redux.js.org/docs/basics/Reducers.html#handling-actions
     * @type {?Function}
     */
    this.reducer = null;

    /**
     * @link https://redux-saga.js.org/
     * @type {?Function}
     */
    this.saga = null;
  }

  /**
   * @returns {string}
   */
  getVendor() {
    return this.vendor;
  }

  /**
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * @returns {string}
   */
  getVersion() {
    return this.version;
  }

  /**
   * @returns {Object}
   */
  getRoutes() {
    return this.routes || {};
  }

  /**
   * @returns {boolean}
   */
  hasReducer() {
    return this.reducer !== null;
  }

  /**
   * @returns {?Function}
   */
  getReducer() {
    return this.reducer;
  }

  /**
   * @returns {boolean}
   */
  hasSaga() {
    return this.saga !== null;
  }

  /**
   * @returns {?Function}
   */
  getSaga() {
    return this.saga;
  }

  /**
   * @param {App} app
   * @param {Bottle} bottle
   */
  configure(app, bottle) {
    // override in concrete plugin
  }

  /**
   * @param {App} app
   */
  start(app) {
    // override in concrete plugin
  }

  /**
   * @param {App} app
   */
  stop(app) {
    // override in concrete plugin
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.toString();
  }

  /**
   * @returns {string}
   */
  toString() {
    return `@${this.vendor}/${this.name}:v${this.version}`;
  }
}
