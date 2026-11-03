let a: unknown = "10";

a = 90;

if (typeof a === "number") {
    console.log("Do Something")
}

console.log(typeof a);