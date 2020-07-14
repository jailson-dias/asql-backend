import { DeepDiff } from 'deep-diff';
import ParseStmtValues from './utils/parseStmtValues';
import changesets from 'diff-json';
const diff = require('diff')

const query1 = `
SELECT * FROM Pessoa
`;

const query2 = `
SELECT cpf, nome, sexo
FROM Pessoa
`;

//   //   console.log('join:\t\t\t', join.join());
//   //   console.log('join inner:\t\t', join.inner());
//   //   console.log('join cross:\t\t', join.cross());
//   //   console.log('join left outer:\t', join.leftOuter());
//   //   console.log('join full outer:\t', join.fullOuter());
//   //   console.log('join right outer:\t', join.rightOuter());

//   //   console.log('target:\t\t\t', target.parseTargetList());
//   //   console.log('distinct:\t\t', distinct.parseDistinct());
//   //   console.log('from:\t\t\t', JSON.stringify(from.tableName(), null, 2));

//   //   console.log('where:\t\t\t', where.joinExpr());

// let parserStmt = new ParseStmtValues();

// let query1Info = parserStmt.query(query1);
// let query2Info = parserStmt.query(query2);
// // console.log(JSON.stringify(query1Info, null, 2));
// // console.log(JSON.stringify(query1Info.select, null, 2));
// // console.log(DeepDiff(query1Info, query2Info));

// // console.log(query.replace(rgRemoveComments, ''));

// const getDeepValue = (obj, path) => {
//   var current = obj;
//   path.split('.').forEach(function (p) {
//     current = current[p];
//   });
//   return current;
// };

// const objectDeepKeys = (obj) => {
//   return Object.keys(obj)
//     .filter((key) => obj[key] instanceof Object)
//     .map((key) => objectDeepKeys(obj[key]).map((k) => `${key}.${k}`))
//     .reduce((x, y) => x.concat(y), Object.keys(obj));
// };

// const getSelectKeys = (deepKeys, obj) => {
//     return deepKeys
//     .map((ykey) => ({
//       key: ykey,
//       value: getDeepValue(obj, ykey),
//     }))
//     .filter((item) => typeof item.value == 'string')
//     .filter(item => {
//           let clauses = [
//               "This isn't a join",
//               "This isn't a distinct clause",
//               "This isn't a into clause",
//               "This isn't a where",
//               "This isn't a order clause",
//               "This isn't a group clause",
//               "This isn't a having clause",
//               "This isn't a from stmt",
//               "This isn't the correct join",
//               "This isn't a target"
//           ]
//           return clauses.indexOf(item.value) == -1
//       })
// }

// let deepKeys = objectDeepKeys(query1Info);
// let deepKeyValue = getSelectKeys(deepKeys, query1Info)

// let deepKeys2 = objectDeepKeys(query2Info);
// let deepKeyValue2 = getSelectKeys(deepKeys2, query2Info)
// console.log(deepKeyValue);
// console.log(deepKeyValue2);

// let diffObj = diff.diffJson(deepKeyValue, deepKeyValue2)

// console.log(JSON.stringify(diffObj, null, 2));

// let difflength = diffObj.map(item => item.count).reduce((previous, current) => previous + current, 0)

// // let value1length = diffObj.map(item => item.added?0:item.count).reduce((previous, current) => previous + current, 0)
// // let value2length = diffObj.map(item => item.removed?0:item.count).reduce((previous, current) => previous + current, 0)
// let equalsValue = diffObj.map(item => item.removed || item.added?0:item.count).reduce((previous, current) => previous + current, 0)
// // let difflength = diffObj[0].changes.map(item => item.changes || item).flat().length
// console.log(difflength, equalsValue, `${equalsValue/difflength*100}%`)

const similarity = (obj1, obj2) => {
  obj1 = JSON.stringify(obj1).replace(/[\[\]\{\}]/g, "").replace(/[\"]/g, " ")
  obj2 = JSON.stringify(obj2).replace(/[\[\]\{\}]/g, "").replace(/[\"]/g, " ")
  // console.log(obj1, obj2)
  let diffStr = diff.diffWords(obj1, obj2)
  // console.log(diffStr)
  let diffAllLength = diffStr.map(item => item.count).reduce((previous, current) => previous + current, 0)
  let diffOnlyEquals = diffStr.map(item => item.removed || item.added?0:item.count).reduce((previous, current) => previous + current, 0)
  return diffOnlyEquals/diffAllLength
}

let obj1 = [
  {
    cpf: '123456789-45',
    nome: 'Leonardo Alves',
    sexo: 'M'
  },
  {
    cpf: '888777666-85',
    nome: 'Marcos Barreto',
    sexo: 'M'
  },
  {
    cpf: '456228741-99',
    nome: 'Afonso Gomes',
    sexo: 'M'
  }]

  let obj2 = [
    {
      cpf: '123456789-45'
    },
    {
      cpf: '888777666-85'
    },
    {
      cpf: '456228741-99'
    }]

console.log(similarity(obj1, obj2))

// let nota1 = (value1length - difflength) / value1length
// let nota2 = (value2length - difflength) / value2length

// console.log(Math.max(0, Math.min(nota1, nota2)))
// console.log(nota1, nota2, value1length, value2length, difflength)
// console.log(diffObj[0].changes.map(item => item.changes || item).flat())


import PostgreSQL from './postgres';
// import { populate as query } from '../populatePostgres';

const rgRemoveComments = /(\/\*[^*]*\*\/)|(\/\/[^*]*)|(--[^.].*)/gm;

let queryWithoutComments = query1.replace(rgRemoveComments, '');
const connectionString = 'postgresql://root:mysecretpassword@localhost:5432/database_teste';
const db = new PostgreSQL(connectionString);

// db.query('CREATE DATABASE database_teste');

// db.query('BEGIN;')
//   .then(() => {
//     let queriesList = queryWithoutComments.split(';').filter(item => item.length > 0)
//     console.log(queriesList)
//     return queriesList.reduce(
//       (promise, query) => promise.then(() => db.query(query)),
//       Promise.resolve()
//     );
//   })
//   .then((pp) => {
//     console.log('qtd lines', pp.rows.length);
//     return db.query('COMMIT;');
//   })
//   .catch((err) => {
//     console.log(err);
//     return db.query('ROLLBACK;');
//   })
//   .finally(() => {
//     db.end();
//   });

let queries = [db.query(query1), db.query(query2)]

// // queries.reduce(
// //         (promise, query) => promise.then(() => db.query(query)),
// //         Promise.resolve()
// //       );

Promise.all(queries).then(([q1, q2]) => {
  let nota = []
  nota.push(q1.rowCount==q2.rowCount?1:0)
  let fields1 = q1.fields.map(item => item.name)
  let fields2 = q2.fields.map(item => item.name)
  console.log(fields1, fields2)
  nota.push(similarity(fields1, fields2)*2)
  // console.log(diff.diffJson(fields1, fields2))
  nota.push(similarity(q1.rows, q2.rows)*7)
  // console.log(q1.rowCount, q2)
  console.log(nota.reduce((p, c) => p+c, 0))
}).catch(err => {
  console.log("err")
})

