import { sum } from "../utils.js";

describe("sum function", () => {

    test("add 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3);
    });

    test("add -10 + 5 equal -5", () => {
        expect(sum(-10, 5)).toBe(-5);
    });

    test("add -0 + 5 equal 5", () => {
        expect(sum(-0, 5)).toBe(5);
    });

});