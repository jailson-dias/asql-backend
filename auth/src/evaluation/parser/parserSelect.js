import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserTarget {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getTableName(target) {
    if (!target) {
      return null;
    }

    let table = {};
    if (target.ResTarget.name) {
      table['asName'] = target.ResTarget.name;
    }

    table['name'] = this.parseStmtValues.expr(target.ResTarget.val);

    return table;
  }

  getSelect() {
    if (!this.stmt.targetList) {
      throw new Error("This isn't a target");
    }

    return this.stmt.targetList;
  }

  parseSelect() {
    try {
      let select = this.getSelect();
      return select.map((target) => this.getTableName(target));
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserTarget;
