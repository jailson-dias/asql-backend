import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserWhere {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getWhere() {
    if (!this.stmt.whereClause) {
      throw new Error("This isn't a where");
    }
    return this.stmt.whereClause;
  }

  parseWhere() {
    try {
      let where = this.getWhere();

      // console.log(where);
      return this.parseStmtValues.expr(where);
    } catch (err) {
      // console.log(err.stack);
      return err.message;
    }
  }
}

export default ParserWhere;
