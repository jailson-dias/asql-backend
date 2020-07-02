import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserGroup {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getGroup() {
    if (!this.stmt.groupClause) {
      throw new Error("This isn't a group clause");
    }

    return this.stmt.groupClause;
  }

  parserGroup() {
    try {
      let group = this.getGroup();

      return group.map((item) => {
        return this.parseStmtValues.expr(item);
      });
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserGroup;
