type KeyType = string | number | symbol;

export class TwoWayMap<K extends KeyType, V extends KeyType> {
  private map: Partial<Record<K, V>>;
  private revMap: Partial<Record<V, K>>;

  constructor(obj: Record<K, V>) {
    this.map = {};
    this.revMap = {};
    for (const key in obj) {
      this.map[key] = obj[key];
      this.revMap[obj[key]] = key;
    }
  }

  get(key: K) {
    return this.map[key];
  }

  getRev(value: V) {
    return this.revMap[value];
  }
}
