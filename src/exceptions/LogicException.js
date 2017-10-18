import TrinitiAppException from './TrinitiAppException';

export default class LogicException extends TrinitiAppException {
  /**
   * @param {string} message
   */
  constructor(message) {
    // 13 = INTERNAL
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L23
    super(message, 13);
  }
}
