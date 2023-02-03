import { dig } from "../../utils/objects";

const testObject = {
  jack: {
    color: "Orange",
    favoriteFoods: {
      butter: true,
      anythingElse: true,
    }
  }
};

it("returns deeply nested values from an object when they exist", () => {
  expect(dig(["jack", "favoriteFoods", "butter"], testObject)).toBe(true);
});

it("returns `null` when path does not exist in object", () => {
  expect(dig(["jack", "favoriteFoods", "broccoli"], testObject)).toBe(null);
});
