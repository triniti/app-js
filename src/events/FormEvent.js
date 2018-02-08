/* eslint-disable class-methods-use-this */
import PbjxEvent from '@gdbots/pbjx/events/PbjxEvent';
import isEmpty from 'lodash/isEmpty';

const nameSym = Symbol('name');
const dataSym = Symbol('data');
const propsSym = Symbol('props');
const errorsSym = Symbol('errors');
const warningsSym = Symbol('warnings');

export default class FormEvent extends PbjxEvent {
  /**
   * @param {Message} message
   * @param {string} name
   * @param {Object} data
   * @param {Object} props
   */
  constructor(message, name = 'form', data = {}, props = {}) {
    super(message);
    this[nameSym] = name;
    this[dataSym] = data;
    this[propsSym] = props;
    this[errorsSym] = {};
    this[warningsSym] = {};
  }

  /**
   * @returns {string}
   */
  getName() {
    return this[nameSym];
  }

  /**
   * @returns {Object}
   */
  getData() {
    return this[dataSym];
  }

  /**
   * @returns {Object}
   */
  getProps() {
    return this[propsSym];
  }

  /**
   * @returns {boolean}
   */
  hasErrors() {
    return isEmpty(this[errorsSym]);
  }

  /**
   * @returns {Object}
   */
  getErrors() {
    return this[errorsSym];
  }

  /**
   * @param {string} fieldName
   * @param {string} error
   *
   * @returns {FormEvent}
   */
  addError(fieldName, error) {
    this[errorsSym][fieldName] = error;
    return this;
  }

  /**
   * @returns {boolean}
   */
  hasWarnings() {
    return isEmpty(this[warningsSym]);
  }

  /**
   * @returns {Object}
   */
  getWarnings() {
    return this[warningsSym];
  }

  /**
   * @param {string} fieldName
   * @param {string} warning
   *
   * @returns {FormEvent}
   */
  addWarning(fieldName, warning) {
    this[warningsSym][fieldName] = warning;
    return this;
  }

  /**
   * @param {Message} message
   *
   * @returns {FormEvent}
   */
  createChildEvent(message) {
    const event = super.createChildEvent(message);

    event[nameSym] = this.getName();
    event[dataSym] = this.getData();
    event[propsSym] = this.getProps();
    event[errorsSym] = this.getErrors();
    event[warningsSym] = this.getWarnings();

    return event;
  }
}
