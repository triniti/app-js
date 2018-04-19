import { getInstance } from './';
import { INJECT } from './constants';

/**
 * Creates a factory that will create a delegate that will be passed
 * to a connected component as "delegate".  This object MUST contain
 * methods that the React component will call when UI events occur,
 * according to its design.
 *
 * This function support dependency injection if using the INJECT
 * symbol.  When used, all dependencies will be provided in an object
 * in the third argument to the factory.
 * const factory = (dispatch, ownProps, dependencies) => {}
 *
 * NOTE: pbjx service is always available.
 *
 * @link https://en.wikipedia.org/wiki/Delegation_pattern
 *
 * @param {Function} factory - a function that creates the delegate
 *
 * @returns {Function} - A function to use as mapDispatchToProps in redux connect.
 */
export default factory => (dispatch, ownProps) => {
  const effectiveFactory = (ownProps && ownProps.delegate) || factory;
  const app = getInstance();

  if (!effectiveFactory[INJECT]) {
    return { dispatch, delegate: effectiveFactory(dispatch, ownProps, { pbjx: app.getPbjx() }) };
  }

  const container = app.getContainer();
  const dependencies = Object.keys(effectiveFactory[INJECT]).reduce((acc, id) => {
    acc[effectiveFactory[INJECT][id]] = container.get(id);
    return acc;
  }, { pbjx: app.getPbjx() });

  return { dispatch, delegate: effectiveFactory(dispatch, ownProps, dependencies) };
};
