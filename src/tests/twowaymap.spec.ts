import { expect } from "chai";
import { describe } from "mocha";
import { TwoWayMap } from "../utils/TwoWayMap";

describe("two way map", () => {
  it("should get normal map values", function () {
    const t = new TwoWayMap({
      foo: 1,
      bar: 2,
      3: "ok",
      car: "egejgkj",
    });
    expect(t.get("foo")).to.equal(1);
    expect(t.get("bar")).to.equal(2);
    expect(t.get(3)).to.equal("ok");
    expect(t.get("car")).to.equal("egejgkj");
  });

  it("should get reverse map values", function () {
    const tt = new TwoWayMap({
      key: "value",
      number: 7,
    });
    expect(tt.getRev("value")).to.equal("key");
    expect(tt.getRev(7)).to.equal("number");
  });

  it("should get nothing if key doesn't exist", function () {
    const t = new TwoWayMap({});
    // okay it will not even pass the type checker
    // @ts-ignore
    expect(t.get("foo")).to.be.undefined;
  });

  it("should get nothing if value doesn't exist", function () {
    const t = new TwoWayMap({});
    // okay it will not even pass the type checker
    // @ts-ignore
    expect(t.getRev("foo")).to.be.undefined;
  });
});
