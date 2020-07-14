export const similarity = (obj1, obj2) => {
  obj1 = JSON.stringify(obj1)
    .replace(/[\[\]\{\}]/g, '')
    .replace(/[\"]/g, ' ');
  obj2 = JSON.stringify(obj2)
    .replace(/[\[\]\{\}]/g, '')
    .replace(/[\"]/g, ' ');

  let diffStr = diff.diffWords(obj1, obj2);
  let diffAllLength = diffStr
    .map((item) => item.count)
    .reduce((previous, current) => previous + current, 0);
  let diffOnlyEquals = diffStr
    .map((item) => (item.removed || item.added ? 0 : item.count))
    .reduce((previous, current) => previous + current, 0);

  return diffOnlyEquals / diffAllLength;
};

const getDeepValue = (obj, path) => {
  var current = obj;
  path.split('.').forEach(function (p) {
    current = current[p];
  });
  return current;
};

export const getSelectKeys = (deepKeys, obj) => {
  return deepKeys
    .map((ykey) => ({
      key: ykey,
      value: getDeepValue(obj, ykey),
    }))
    .filter((item) => typeof item.value == 'string')
    .filter((item) => {
      let clauses = [
        "This isn't a join",
        "This isn't a distinct clause",
        "This isn't a into clause",
        "This isn't a where",
        "This isn't a order clause",
        "This isn't a group clause",
        "This isn't a having clause",
        "This isn't a from stmt",
        "This isn't the correct join",
        "This isn't a target",
      ];
      return clauses.indexOf(item.value) == -1;
    });
};

export const objectDeepKeys = (obj) => {
  return Object.keys(obj)
    .filter((key) => obj[key] instanceof Object)
    .map((key) => objectDeepKeys(obj[key]).map((k) => `${key}.${k}`))
    .reduce((x, y) => x.concat(y), Object.keys(obj));
};
