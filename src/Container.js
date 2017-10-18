import EntryNotFound from './exceptions/EntryNotFound';
import LogicException from './exceptions/LogicException';

const privateProps = new WeakMap();

/**
 * Provides a simple api wrapping a bottlejs instance.
 * This ensures at runtime that a consumer of the container
 * is not able to modify the container.
 *
 * @link https://github.com/young-steveo/bottlejs
 */
export default class Container {
  /**
   * @param {Bottle} bottle
   */
  constructor(bottle) {
    const instance = { bottle };
    privateProps.set(this, instance);
  }

  /**
   * Finds an entry of the container by its identifier and returns it.
   *
   * @params {string} id - Identifier of the entry to look for.
   *
   * @returns {*}
   *
   * @throws {EntryNotFound}
   * @throws {LogicException}
   */
  get(id) {
    if (!this.has(id)) {
      throw new EntryNotFound(id);
    }

    try {
      return privateProps.get(this).bottle.container[id];
    } catch (e) {
      throw new LogicException(`Error while retrieving the entry [${id}] from the container. ${e.message}`);
    }
  }

  /**
   * Returns true if the container can return an entry for the given identifier.
   * Returns false otherwise.
   *
   * `has(id)` returning true does not mean that `get(id)` will not throw an exception.
   * It does however mean that `get(id)` will not throw a `EntryNotFound`.
   *
   * @params {string} id - Identifier of the entry to look for.
   *
   * @returns {boolean}
   */
  has(id) {
    const { bottle } = privateProps.get(this);
    if (bottle.providerMap[id]) {
      return true;
    }

    return bottle.container.$list().includes(id);
  }
}
