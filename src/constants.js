export const SERVICE_PREFIX = '@triniti/app/';
const t = id => `${SERVICE_PREFIX}${id}`;

/**
 * Any services registered in the {@see Container} should use these identifiers.
 *
 * @link https://martinfowler.com/articles/injection.html#UsingAServiceLocator
 *
 * @type {Object}
 */
export const serviceIds = {
  PREFIX: SERVICE_PREFIX,
  APP: t('app'),
  CONTAINER: t('container'),
  REDUX_STORE: t('redux/store'),
};

/**
 * @link http://redux.js.org/docs/basics/Actions.html
 *
 * @type {Object}
 */
export const actionTypes = {
  PREFIX: SERVICE_PREFIX,
  APP_STARTED: t('APP_STARTED'),
  APP_STOPPED: t('APP_STOPPED'),
};

/**
 * The Ioc middleware in "./redux/createInjectMiddleware.js" requires that a
 * symbol be added to any dispatched thunk that requires dependency injection.
 *
 * @example
 * function requestLogin({ dispatch, authenticator }) {
 *   dispatch({ type: actionTypes.LOGIN_REQUESTED });
 *   authenticator.login();
 * }
 *
 * requestLogin[INJECT] = { serviceIds.AUTHENTICATOR: 'authenticator' };
 * return requestLogin;
 *
 * @type {Symbol}
 */
export const INJECT = Symbol('inject');

/**
 * Common statuses for managing state changes for async operations.
 * Use these constants for consistency and clarity when creating
 * actions, reducers, selectors that need to know about the "state".
 */
export const STATUS_NONE = 'none';
export const STATUS_PENDING = 'pending';
export const STATUS_FULFILLED = 'fulfilled';
export const STATUS_REJECTED = 'rejected';
export const STATUS_FAILED = 'failed';
