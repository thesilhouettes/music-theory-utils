/**
 * Allowed key types in {@link TwoWayMap}
 */
export type KeyType = string | number | symbol;

/**
 * Map structure in both directions, not only keys can access values
 * but values can also access keys. Very rough implementation though.
 */
export class TwoWayMap<K extends KeyType, V extends KeyType> {
  // stores keys -> values
  private map: Partial<Record<K, V>>;
  // stores values -> keys
  private revMap: Partial<Record<V, K>>;

  /**
   * Get the keys of the obj and populate the data structure.
   * @param obj the keys and values that should be inserted into the map
   */
  constructor(obj: Record<K, V>) {
    this.map = {};
    this.revMap = {};
    for (const key in obj) {
      this.map[key] = obj[key];
      this.revMap[obj[key]] = key;
    }
  }

  /**
   * Get the value from a key.
   * @param key the name of key
   * @returns the value associated with it if found, `undefined` otherwise
   */
  get(key: K) {
    return this.map[key];
  }

  /**
   * Get the key from a key.
   * @param value the value of a key
   * @returns the key of it is found, `undefined` otherwise
   */
  getRev(value: V) {
    return this.revMap[value];
  }
}
