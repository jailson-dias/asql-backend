import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserOrder {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getSortBy(sortby) {
    // console.log(sortby);

    return {
      column: this.parseStmtValues.expr(sortby.node),
      sortby_dir: sortby.sortby_dir,
      sortby_nulls: sortby.sortby_nulls,
    };
  }

  getOrder() {
    let sortClause = this.stmt.sortClause;
    if (!sortClause) {
      throw new Error("This isn't a order clause");
    }

    return sortClause;
  }

  parseOrder() {
    try {
      let order = this.getOrder();

      // console.log(order);
      return order.map((item) => this.getSortBy(item.SortBy));
    } catch (err) {
      // console.log(err.message);
      return err.message;
    }
  }
}

export default ParserOrder;
