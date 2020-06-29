import parser from './src/parser';

// const { Pool, Client } = require('pg');
// const connectionString =
//   'postgresql://root:mysecretpassword@localhost:5432/database_teste';

// import { Parser } from 'node-sql-parser';
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

// const client = new Client({
//   connectionString: connectionString,
// });
// client.connect();
// pool.query(
//   "INSERT INTO table_name (name, age, city) VALUES ('my name', 20, 'city')"
// );

// pool.query('SELECT * FROM table_name', (err, res) => {
//   console.log(err, res);
//   //   client.end();
// });

// let a = client.query('SELECT * FROM database_teste');
// console.log(a);

// client.query(
//   'CREATE TABLE table_name (name varchar(255), age int, city varchar(255))'
// );
// client.query('CREATE DATABASE database_teste');

// const parser = new Parser();
// const opt = {
//   database: 'postgresql', // MySQL is the default database
// };

// const rgRemoveComments = /(\/\*[^*]*\*\/)|(\/\/[^*]*)|(--[^.].*)/gm;
// import { populate as query } from './populatePostgres';

// let sq = `SELECT * FROM table_name;
//   -- teste
//   SELECT asd,dfg FROM table_name`;
// let queryWithoutComments = query.replace(rgRemoveComments, '');

// const db = new PostgreSQL(connectionString);

// db.query('BEGIN;')
//   .then(() => {
//     let queriesList = queryWithoutComments.split(';').slice(0, -1);
//     return queriesList.reduce(
//       (promise, query) => promise.then(() => db.query(query)),
//       Promise.resolve()
//     );
//   })
//   .then((pp) => {
//     console.log('success', pp.length);
//     return db.query('COMMIT;');
//   })
//   .catch((err) => {
//     console.log(err);
//     return db.query('ROLLBACK;');
//   })
//   .finally(() => {
//     db.end();
//   });

// where TABLE_TYPE='BASE TABLE' and
// table_schema NOT IN ('information_schema', 'pg_catalog')

// db.listTables()
//   .then((tables) => {
//     console.log(tables);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const parser = require('pg-query-parser');

// const parsed = parser.parse(queryWithoutComments);

// query[0].SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

// console.log(JSON.stringify(parsed, null, 2));

// const ast = parser.astify(queryWithoutComments, opt);

// console.log(JSON.stringify(ast, null, 2));

// console.log(query.replace(rgRemoveComments, ''));

// const sql = parser.sqlify(ast, opt);

// console.log(sql);

// const parser = require('pgsql-parser');

// const qq = parser.parse(queryWithoutComments);
// console.log(qq);

// console.log(parser.deparse(qq));
