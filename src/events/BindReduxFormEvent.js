/* eslint-disable class-methods-use-this */
import PbjxEvent from '@gdbots/pbjx/events/PbjxEvent';

const formNameSym = Symbol('formName');
const formDataSym = Symbol('formData');

export default class BindReduxFormEvent extends PbjxEvent {
  /**
   * @param {Message} message
   * @param {string} formName
   * @param {Object} formData
   */
  constructor(message, formName, formData) {
    super(message);
    this[formNameSym] = formName;
    this[formDataSym] = formData;
  }

  /**
   * @returns {string}
   */
  getFormName() {
    return this[formNameSym];
  }

  /**
   * @returns {Object}
   */
  getFormData() {
    return this[formDataSym];
  }

  /**
   * @returns {boolean}
   */
  supportsRecursion() {
    return false;
  }
}
