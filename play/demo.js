let _array = ["a", "b", "c", "d"];
let _new_array = [];

for (let i of _array) {
  let obj = { name: i, val: i.toUpperCase() };
  _new_array.push(obj);
  console.log("Array:", _new_array);
  obj.name = "e";
  obj.val = "E";
}

console.log("Result:", _new_array);

// Can you  ???
