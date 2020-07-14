import ParseStmtValues from '../../utils/parseStmtValues';

class ParserDistinct {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  parseDistinct() {
    try {
      if (!this.stmt.distinctClause) {
        throw new Error("This isn't a distinct clause");
      }

      return this.stmt.distinctClause;
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserDistinct;
