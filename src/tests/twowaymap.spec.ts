import { TwoWayMap } from "../utils/TwoWayMap";

describe("two way map", () => {
  test("should get normal map values", function () {
    const t = new TwoWayMap([
      ["foo", 1],
      ["bar", 2],
      [3, "ok"],
      ["car", "egejgkj"],
    ]);
    expect(t.get("foo")).toEqual(1);
    expect(t.get("bar")).toEqual(2);
    expect(t.get(3)).toEqual("ok");
    expect(t.get("car")).toEqual("egejgkj");
  });

  test("should get reverse map values", function () {
    const tt = new TwoWayMap([
      ["key", "value"],
      ["number", 7],
    ]);
    expect(tt.getRev("value")).toEqual("key");
    expect(tt.getRev(7)).toEqual("number");
  });

  test("should get nothing if key doesn't exist", function () {
    const t = new TwoWayMap({});
    expect(t.get("foo")).toBe(undefined);
  });

  test("should get nothing if value doesn't exist", function () {
    const t = new TwoWayMap({});
    expect(t.getRev("foo")).toBe(undefined);
  });

  test("get all entries / values / keys", function () {
    const tt = [
      ["a", 3],
      ["b", 7],
      ["c oh", 114],
      [2.3, { h: 3, y: 4 }],
    ];
    const t = new TwoWayMap(tt);
    expect([...t.getAllKeys()]).toEqual(["a", "b", "c oh", 2.3]);
    expect([...t.getAllValues()]).toEqual([3, 7, 114, { h: 3, y: 4 }]);
    expect([...t.getRevAllValues()]).toEqual(["a", "b", "c oh", 2.3]);
    expect([...t.getRevAllKeys()]).toEqual([3, 7, 114, { h: 3, y: 4 }]);
    expect([...t.getRevAllEntries()]).toEqual([
      [3, "a"],
      [7, "b"],
      [114, "c oh"],
      [{ h: 3, y: 4 }, 2.3],
    ]);
    expect([...t.getAllEntries()]).toEqual([
      ["a", 3],
      ["b", 7],
      ["c oh", 114],
      [2.3, { h: 3, y: 4 }],
    ]);
  });
});
