import sum from "../src/utils.js";

describe("sum function", () => {

    test("add 10 + 20 to equal 30", () => {
        expect(sum(10, 20)).toBe(30);
    });

    test("add -15 + 0 to equal -15", () => {
        expect(sum(-15, 0)).toBe(-15);
    });

    test("add 0 + -0 to equal 0", () => {
        expect(sum(0, -0)).toBe(0);
    });
});