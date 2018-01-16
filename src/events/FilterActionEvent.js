/* eslint-disable class-methods-use-this */
import Event from '@gdbots/pbjx/events/Event';

const appSym = Symbol('app');
const actionSym = Symbol('action');
const storeSym = Symbol('store');

export default class FilterActionEvent extends Event {
  /**
   * @param {App}    app    - The app instance.
   * @param {Object} action - The redux action being dispatched.
   * @param {Object} store  - The redux store.
   */
  constructor(app, action, store) {
    super();
    this[appSym] = app;
    this[actionSym] = action;
    this[storeSym] = store;
  }

  /**
   * @returns {App}
   */
  getApp() {
    return this[appSym];
  }

  /**
   * @returns {Object}
   */
  getAction() {
    return this[actionSym];
  }

  /**
   * @returns {{getState: function, dispatch: function, subscribe: function}}
   */
  getRedux() {
    return this[storeSym];
  }
}
