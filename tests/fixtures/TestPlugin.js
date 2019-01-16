/* eslint-disable no-console */
import Plugin from '../../src/Plugin';
import { actionTypes } from '../../src/constants';
import TestFormReducers from './TestFormReducers';

export default class TestPlugin extends Plugin {
  constructor() {
    super('triniti', 'test', '0.1.0');
    this.called = 0;
    this.interceptorEvent = null;

    this.onAppStarted = this.onAppStarted.bind(this);
    this.onInterceptorAction = this.onInterceptorAction.bind(this);
  }

  configure() {
    this.reducer = (prevState = {}, action) => (
      { ...prevState, lastAction: action.type }
    );
    this.formReducers = TestFormReducers;
  }

  onAppStarted() {
    this.called += 1;
  }

  /**
   * @param {FilterActionEvent} event
   */
  onInterceptorAction(event) {
    this.interceptorEvent = event;
    this.called += 1;

    const action = event.getAction();
    action.worked = true;
  }

  getSubscribedEvents() {
    return {
      [actionTypes.APP_STARTED]: this.onAppStarted,
      interceptor: this.onInterceptorAction,
    };
  }
}
