import LogicException from './LogicException';

export default class EntryNotFound extends LogicException {
  /**
   * @param {string} entryId
   */
  constructor(entryId) {
    super(`Entry id [${entryId}] was not found in the container.`);
    this.entryId = entryId;
  }

  /**
   * @returns {string}
   */
  getEntryId() {
    return this.entryId;
  }
}
