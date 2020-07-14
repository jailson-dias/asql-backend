import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserHaving {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getHaving() {
    if (!this.stmt.havingClause) {
      throw new Error("This isn't a having clause");
    }

    return this.stmt.havingClause;
  }

  parserHaving() {
    try {
      let having = this.getHaving();
      // console.log(having);
      return this.parseStmtValues.expr(having);
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserHaving;
