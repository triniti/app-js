import { touch } from 'redux-form';

/**
 * Gathers all fields with sync errors and dispatches
 * a touch action to kick off inline validation.
 *
 * @link https://redux-form.com/7.2.1/docs/api/actioncreators.md/#-code-touch-form-string-fields-string-code-
 *
 * @param {Function} dispatch
 * @param {string}   formName
 * @param {?Object}  syncErrors
 *
 * @returns {boolean} - Always returns true
 */
export default (dispatch, formName, syncErrors) => {
  if (syncErrors) {
    const fields = [];

    Object.keys(syncErrors).forEach((fieldName) => {
      if (Array.isArray(syncErrors[fieldName])) {
        syncErrors[fieldName].forEach((f, i) => {
          fields.push(`${fieldName}[${i}]`); // ex: allowed[0]
        });
      } else {
        fields.push(fieldName);
      }
    });

    if (fields.length) {
      dispatch(touch(formName, ...fields));
    }
  }

  return true;
};
