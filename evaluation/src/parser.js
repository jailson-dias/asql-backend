import { DeepDiff } from 'deep-diff';
import ParseStmtValues from '../utils/parseStmtValues';

const query1 = `
SELECT Customers.CustomerName, Orders.OrderID
INTO CustomersOrderBackup2017
FROM Customers
LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
`;

const query2 = `
SELECT TerritoryID, AverageBonus
FROM  tab a, (SELECT   TerritoryID, Avg(Bonus) AS AverageBonus
        FROM    Sales.SalesPerson
        GROUP BY TerritoryID) AS TerritorySummary
ORDER BY AverageBonus
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

let parserStmt = new ParseStmtValues();

let query1Info = parserStmt.query(query1);
// let query2Info = getQueryInformation(query2);
console.log(JSON.stringify(query1Info, null, 2));
// console.log(JSON.stringify(query1Info.select, null, 2));
// console.log(DeepDiff(query1Info, query2Info));

// console.log(query.replace(rgRemoveComments, ''));

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

// let deepKeys = objectDeepKeys(query1Info);
// let deepKeyValue = deepKeys
//   .map((ykey) => ({
//     key: ykey,
//     value: getDeepValue(query1Info, ykey),
//   }))
//   .filter((item) => typeof item.value == 'string');
//   .filter(item => ["This isn't a join", "This isn't a distinct clause"]item.value)
// console.log(deepKeyValue);
