const parser = require('pg-query-parser');

class ParserJoin {
  constructor(query) {
    let parsed = parser.parse(query);
    this.query = parsed.query;
  }

  parseTableName(table) {
    let tableObject = {
      tableName: table.relname,
    };

    if (table.alias) {
      tableObject.asName = table.alias.Alias.aliasname;
    }

    return tableObject;
  }

  getFrom() {
    let joinStmt = this.query || {};
    if (!joinStmt[0]) {
      throw new Error("This isn't a join");
    }
    joinStmt = joinStmt[0];
    if (!joinStmt.SelectStmt) {
      throw new Error("This isn't a join");
    }
    joinStmt = joinStmt.SelectStmt;
    if (!joinStmt.fromClause) {
      throw new Error("This isn't a join");
    }
    return joinStmt.fromClause;
  }

  tableName() {
    try {
      let fromClause = this.getFrom();

      return fromClause.map((table) => this.parseTableName(table.RangeVar));
    } catch (err) {
      //   console.log(err.message);
      return null;
    }
  }
}

export default ParserJoin;
