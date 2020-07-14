const { Pool } = require('pg');

class PostgreSQL {
  constructor(connectionString) {
    this.pool = new Pool({
      connectionString: connectionString,
    });
  }

  _getLineError(error, query) {
    const errorPosition = parseInt(error.position, 10);
    let lineStart = query.slice(0, errorPosition).lastIndexOf('\n') + 1;
    let lineEnd = errorPosition + query.slice(errorPosition).indexOf('\n');
    if (lineEnd < errorPosition) {
      lineEnd = query.length;
    }
    return {
      message: error.message,
      line: query.slice(lineStart, lineEnd),
    };
  }

  query(query) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, (err, data) => {
        if (err) {
          console.log('error quering on database');
          return reject(this._getLineError(err, query));
        }
        console.log('Successfuly executed:', query);
        return resolve(data);
      });
    });
  }

  queryList(queries) {
    this.query('BEGIN;')
      .then(() => {
        let queriesList = queries.split(';').slice(0, -1);
        return queriesList.reduce(
          (promise, query) => promise.then(() => this.query(query)),
          Promise.resolve()
        );
      })
      .then(() => {
        return this.query('COMMIT;');
      })
      .catch(() => {
        return this.query('ROLLBACK;');
      });
  }

  listTables() {
    return this.query(
      `SELECT * FROM INFORMATION_SCHEMA.COLUMNS
        where table_schema NOT IN ('information_schema', 'pg_catalog')`
    ).then((infoColumns) => {
      let columns = infoColumns.rows.map((row) => ({
        table: row.table_name,
        column: row.column_name,
        type: row.udt_name,
      }));

      let tables = {};
      columns.forEach((column) => {
        let columnName = column.column;
        let tableName = column.table;
        if (tables[tableName]) {
          tables[tableName].push(columnName);
        } else {
          tables[tableName] = [columnName];
        }
      });
      return tables;
    });
  }

  end() {
    this.pool.end();
  }
}

export default PostgreSQL;
