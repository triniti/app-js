import { INJECT } from './constants';

/**
 * Creates a redux middleware that injects a function's dependencies
 * from the provided container.  This replaces the need for
 * redux-thunk since it is also handling functions.
 *
 * @param {Container} container
 *
 * @returns {Function}
 */
export default container => ({ dispatch, getState }) => next => (action) => {
  if (typeof action !== 'function') {
    return next(action);
  }

  if (!action[INJECT]) {
    return action(dispatch, getState);
  }

  const dependencies = Object.keys(action[INJECT]).reduce((acc, id) => {
    acc[action[INJECT][id]] = container.get(id);
    return acc;
  }, {});

  return action({ ...dependencies, dispatch, getState });
};
