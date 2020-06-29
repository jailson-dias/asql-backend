import { diff2 } from 'diff';
const diff = require('diff');
// var changesets = require('diff-json');
import changesets from 'diff-json';

// console.log(diff2);
let a = [1, 2, 3, 4, 5, 6];
let b = [1, 2, 5, 4, 6];
let c = [6, 2, 3, 4, 6, 6];

let result = changesets.diff(
  {
    a,
    b,
    c,
  },
  { a, b: c, c: a }
);

// let vv = '';

// let bb = result.forEach((key) => {
//   if (!key.removed) {
//     vv += key.value;
//     console.log(key.count, ':', key.value);
//   }

//   // if
//   // console.log(key.added, key.removed, key.count, key.value);
// });

let changes = result.map((item) => {
  return {
    [item.key]: item.changes.map((change) => change.key),
  };
});

console.log(changes);

console.log(JSON.stringify(result, null, 2));

// console.log(vv);
