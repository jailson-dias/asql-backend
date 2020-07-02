import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserFrom {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getFrom() {
    if (!this.stmt.fromClause) {
      throw new Error("This isn't a from stmt");
    }
    return this.stmt.fromClause;
  }

  parseTableName() {
    try {
      let fromClause = this.getFrom();
      // console.log('inicio', fromClause);

      return fromClause.map((table) => {
        if (table.JoinExpr) {
          throw new Error("This isn't a from stmt");
        }
        return this.parseStmtValues.expr(table);
      });
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserFrom;
