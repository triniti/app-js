import isPlainObject from 'lodash/isPlainObject';
import FilterActionEvent from '../events/FilterActionEvent';

/**
 * Creates an interceptor middleware to allow filtering of actions
 * and potentially stopping them altogether.
 *
 * @example
 *  // in app/plugin using getSubscribedEvents or directly on the dispatcher
 *  app.getDispatcher().addListener('some-action-type', (filterActionEvent) => {
 *    const action = filterActionEvent.getAction();
 *    action.newProperty = 'value';
 *    // filterActionEvent.stopPropagation(); // to stop the action
 *  });
 *
 * @link https://en.wikipedia.org/wiki/Intercepting_filter_pattern
 * @link https://en.wikipedia.org/wiki/Interceptor_pattern
 *
 * @param {App} app
 *
 * @returns {Function}
 */
export default (app) => {
  const dispatcher = app.getDispatcher();

  return store => next => (action) => {
    if (!isPlainObject(action)) {
      return next(action);
    }

    if (!action.type || !dispatcher.hasListeners(action.type)) {
      return next(action);
    }

    const event = new FilterActionEvent(app, action, store);
    dispatcher.dispatch(action.type, event);

    if (event.isPropagationStopped()) {
      return event.getAction();
    }

    return next(event.getAction());
  };
};
