/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Map structure in both directions, not only keys can access values
 * but values can also access keys. Very rough implementation though.
 * Not recommended to use outside this library.
 */
export class TwoWayMap {
  // stores keys -> values
  public map: Map<any, any>;
  // stores values -> keys
  public revMap: Map<any, any>;

  /**
   * Get the keys of the obj and populate the data structure.
   * @param obj the entries that should be added to the map
   * @example
   * ```ts
   * new TwoWayMap([["foo", 32], ["bar", 23]])
   * ```
   * @remarks Currently the function still accepts objects, but for the next major version, this function signature will be removed. The object parameter should be replaced with entries array.
   */
  constructor(obj: any[][] | Record<any, any>) {
    this.map = new Map();
    this.revMap = new Map();
    if (obj instanceof Array) {
      obj.forEach((entry) => {
        const [k, v] = entry;
        this.map.set(k, v);
        this.revMap.set(v, k);
      });
    } else {
      // will be removed in the next major release
      for (const key in obj) {
        let _key: string | number = key;
        const number = Number.parseInt(key);
        if (!Number.isNaN(number)) {
          _key = number;
        }
        this.map.set(_key, obj[_key] as any);
        this.revMap.set(obj[_key], _key);
      }
    }
  }

  /**
   * Get the value from a key.
   * @param key the name of key
   * @returns the value associated with it if found, `undefined` otherwise
   */
  get(key: any) {
    return this.map.get(key);
  }

  /**
   * @returns keys method on the key => value map
   */
  getAllKeys() {
    return this.map.keys();
  }

  /**
   * @returns values method on the key => value map
   */
  getAllValues() {
    return this.map.values();
  }

  /**
   * @returns entries method on the key => value map
   */
  getAllEntries() {
    return this.map.entries();
  }

  /**
   * Get the key from a key.
   * @param value the value of a key
   * @returns the key of it is found, `undefined` otherwise
   */
  getRev(value: any) {
    return this.revMap.get(value);
  }

  /**
   * @returns keys method on the value => key map
   */
  getRevAllKeys() {
    return this.revMap.keys();
  }

  /**
   * @returns entries method on the value => key map
   */
  getRevAllEntries() {
    return this.revMap.entries();
  }

  /**
   * @returns values method on the value => key map
   */
  getRevAllValues() {
    return this.revMap.values();
  }
}
