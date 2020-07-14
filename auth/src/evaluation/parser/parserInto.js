import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserInto {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getInto() {
    let intoClause = this.stmt.intoClause;
    if (!intoClause) {
      throw new Error("This isn't a into clause");
    }

    if (!intoClause.IntoClause) {
      throw new Error("This isn't a into clause");
    }

    return intoClause.IntoClause;
  }

  parseInto() {
    try {
      let into = this.getInto();
      return this.parseStmtValues.expr(into.rel);
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserInto;
