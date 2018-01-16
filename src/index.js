import App from './App';
import Plugin from './Plugin';
import * as constants from './constants';

/**
 * WARNING! A global, the horror.  ლ(ಠ益ಠლ)
 * @link http://e.lvme.me/v2pos5d.jpg
 *
 * This exists primarily for use in React where we need the Highlander app
 * instance but using React context would be more putrid then this here global.
 *
 * @link https://reactjs.org/docs/context.html
 * > If you want your application to be stable, don't use context.
 *
 * Great, that's helpful.  React router, localization plugins, theming, redux,
 * etc. use context... sweet jeebus we don't have time for this.
 *
 * We have successfully provided dependency injection through middleware on
 * action creators (thunks) and the app instance is automatically given to
 * sagas but what about React components?  What about lazy loaded components?
 *
 * Solution, import this file and use `getInstance` to get it.
 * Use this sparingly or NOT at all if you can.  This is a slimy edge case
 * and frankly it will probably be eliminated before version 1 happens
 * as with enough time and coffee we'll find a better way.
 *
 * @type {?App}
 */
let instance = null;

/**
 * @returns {boolean}
 */
const hasInstance = () => instance !== null;

/**
 * @returns {?App}
 */
const getInstance = () => instance;

/**
 * @param {?App} newInstance
 */
// eslint-disable-next-line no-return-assign
const setInstance = newInstance => instance = newInstance;

export { App, Plugin, constants, hasInstance, getInstance, setInstance };

export default {
  App,
  Plugin,
  constants,
  hasInstance,
  getInstance,
  setInstance,
};
