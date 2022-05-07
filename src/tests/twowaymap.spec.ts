import { TwoWayMap } from "../utils/TwoWayMap";

describe("two way map", () => {
  test("should get normal map values", function () {
    const t = new TwoWayMap({
      foo: 1,
      bar: 2,
      3: "ok",
      car: "egejgkj",
    });
    expect(t.get("foo")).toEqual(1);
    expect(t.get("bar")).toEqual(2);
    expect(t.get(3)).toEqual("ok");
    expect(t.get("car")).toEqual("egejgkj");
  });

  test("should get reverse map values", function () {
    const tt = new TwoWayMap({
      key: "value",
      number: 7,
    });
    expect(tt.getRev("value")).toEqual("key");
    expect(tt.getRev(7)).toEqual("number");
  });

  // test("should get nothing if key doesn't exist", function () {
  //   const t = new TwoWayMap({});
  //   // okay test will not even pass the type checker
  //   expect(t.get("foo")).toBe(undefined);
  // });

  // test("should get nothing if value doesn't exist", function () {
  //   const t = new TwoWayMap({});
  //   // okay test will not even pass the type checker
  //   expect(t.getRev("foo")).toBe(undefined);
  // });
});
