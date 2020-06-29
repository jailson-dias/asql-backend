const parser = require('pg-query-parser');

class ParserJoin {
  constructor(query) {
    let parsed = parser.parse(query);
    this.query = parsed.query;
  }

  parseAExpr(aExpr) {
    let name = aExpr.name.map((key) => key.String.str).join(' ');

    let left = aExpr.lexpr.ColumnRef.fields
      .map((field) => field.String.str)
      .join('.');
    let right = aExpr.rexpr.ColumnRef.fields
      .map((field) => field.String.str)
      .join('.');

    return {
      name,
      left,
      right,
    };
  }

  parseQuals(quals) {
    if (!quals) {
      return [];
    }
    if (quals.BoolExpr) {
      let expressions = quals.BoolExpr.args
        .map((expr) => this.parseQuals(expr))
        .flat();

      let boolop = {
        boolop: quals.BoolExpr.boolop,
      };

      let firstExpressions = expressions.slice(0, -1);
      let lastExpression = expressions[expressions.length - 1];
      return [...firstExpressions, boolop, lastExpression];
    }

    return [this.parseAExpr(quals.A_Expr)];
  }

  getJoin() {
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
    joinStmt = joinStmt.fromClause;
    if (!joinStmt[0]) {
      throw new Error("This isn't a join");
    }
    joinStmt = joinStmt[0];
    if (!joinStmt.JoinExpr) {
      throw new Error("This isn't a join");
    }
    return joinStmt.JoinExpr;
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

  joinExpr(type, isCorrectJoinType = null) {
    try {
      let joinStmt = this.getJoin();

      if (joinStmt.jointype !== type) {
        throw new Error("This isn't the correct join");
      }

      if (isCorrectJoinType && !isCorrectJoinType(joinStmt)) {
        throw new Error("This isn't the correct join");
      }

      const tableLeft = this.parseTableName(joinStmt.larg.RangeVar);

      const tableRight = this.parseTableName(joinStmt.rarg.RangeVar);

      let quals = this.parseQuals(joinStmt.quals);

      return {
        left: tableLeft,
        right: tableRight,
        quals,
      };
    } catch (err) {
      //   console.log(err.message);
      return null;
    }
  }

  join() {
    return this.joinExpr(0);
  }

  inner() {
    return this.joinExpr(0, (joinExpr) => joinExpr.quals != null);
  }

  cross() {
    return this.joinExpr(0, (joinExpr) => {
      return (
        !joinExpr.isNatural &&
        !(joinExpr.quals != null) &&
        !(joinExpr.usingClause != null)
      );
    });
  }

  leftOuter() {
    return this.joinExpr(1);
  }

  fullOuter() {
    return this.joinExpr(2);
  }

  rightOuter() {
    return this.joinExpr(3);
  }
}

export default ParserJoin;
