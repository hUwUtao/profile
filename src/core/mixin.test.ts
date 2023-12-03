import { expect, test } from "vitest";

import mixin from "./mixin";

test("class mixin slice", () => {
  expect(mixin("hello", "world bye")).toBe("hello world bye");
});

test("class mixin dx flow", () => {
  expect(mixin("are you", false && "there")).toBe("are you");
});

test("class mixin datatype proof", () => {
  expect(mixin("srs", 0 && "ly", 0x32)).toBe("srs " + 0x32);
});
