import ParseStmtValues from '../../utils/parseStmtValues';
import ParseBasicValues from '../../utils/parseBasicValues';

class ParserJoin {
  constructor(query) {
    this.parseStmtValues = new ParseStmtValues();
    this.parseBasicValues = new ParseBasicValues();
    this.stmt = this.parseStmtValues.getStmt(query);
  }

  getJoin() {
    let fromClause = this.stmt.fromClause;
    if (!fromClause) {
      throw new Error("This isn't a join");
    }
    if (!fromClause[0]) {
      throw new Error("This isn't a join");
    }
    fromClause = fromClause[0];
    if (!fromClause.JoinExpr) {
      throw new Error("This isn't a join");
    }
    return fromClause.JoinExpr;
  }

  joinExpr(type, isCorrectJoinType = null) {
    try {
      let joinStmt = this.getJoin();

      if (joinStmt.jointype !== type) {
        throw new Error("This isn't the correct join");
      }

      if (isCorrectJoinType && !isCorrectJoinType(joinStmt)) {
        throw new Error("This isn't the correct join");
      }

      return {
        left: this.parseStmtValues.expr(joinStmt.larg),
        right: this.parseStmtValues.expr(joinStmt.rarg),
        quals: this.parseStmtValues.expr(joinStmt.quals),
      };
    } catch (err) {
      //   console.log(err.message);
      return err.message;
    }
  }

  parseJoin() {
    return this.joinExpr(0);
  }

  parseInner() {
    return this.joinExpr(0, (joinExpr) => joinExpr.quals != null);
  }

  parseCross() {
    return this.joinExpr(0, (joinExpr) => {
      return (
        !joinExpr.isNatural &&
        !(joinExpr.quals != null) &&
        !(joinExpr.usingClause != null)
      );
    });
  }

  parseLeftOuter() {
    return this.joinExpr(1);
  }

  parseFullOuter() {
    return this.joinExpr(2);
  }

  parseRightOuter() {
    return this.joinExpr(3);
  }
}

export default ParserJoin;
