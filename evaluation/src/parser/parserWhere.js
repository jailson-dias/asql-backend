const parser = require('pg-query-parser');

class ParserJoin {
  constructor(query) {
    let parsed = parser.parse(query);
    this.query = parsed.query;
  }

  parseColumnRef(columns) {
    return columns
      .map((field) => {
        if (field.A_Star) {
          return '*';
        }
        return field.String.str;
      })
      .join('.');
  }

  parseAExpr(aExpr) {
    let name = aExpr.name.map((key) => key.String.str).join(' ');
    // console.log('nn', aExpr.name);

    let left = aExpr.lexpr;
    // console.log('left', left);
    if (left.ColumnRef) {
      left = this.parseColumnRef(left.ColumnRef.fields);
    } else {
      left = left.map((column) => this.parseColumnRef(column.ColumnRef.fields));
    }
    let right = aExpr.rexpr;
    // console.log('right', right);
    if (right.ColumnRef) {
      right = this.parseColumnRef(right.ColumnRef.fields);
    } else {
      right = right.map((column) =>
        this.parseColumnRef(column.ColumnRef.fields)
      );
    }

    return {
      name,
      left,
      right,
    };
  }

  parseWhere(quals) {
    if (!quals) {
      return [];
    }
    console.log(quals);
    if (quals.BoolExpr) {
      console.log(quals.BoolExpr.args);
      let expressions = quals.BoolExpr.args
        .map((expr) => this.parseWhere(expr))
        .flat();

      let boolop = {
        boolop: quals.BoolExpr.boolop,
      };

      let firstExpressions = expressions.slice(0, -1);
      let lastExpression = expressions[expressions.length - 1];
      return [...firstExpressions, boolop, lastExpression];
    } else if (quals.NullTest) {
      console.log(quals.NullTest);
      return 'nuu';
    }

    return [this.parseAExpr(quals.A_Expr)];
  }

  getWhere() {
    let joinStmt = this.query || {};
    if (!joinStmt[0]) {
      throw new Error("This isn't a where");
    }
    joinStmt = joinStmt[0];
    if (!joinStmt.SelectStmt) {
      throw new Error("This isn't a where");
    }
    joinStmt = joinStmt.SelectStmt;
    if (!joinStmt.whereClause) {
      throw new Error("This isn't a where");
    }
    return joinStmt.whereClause;
  }

  joinExpr() {
    try {
      let joinStmt = this.getWhere();
      console.log(joinStmt);

      let quals = this.parseWhere(joinStmt);

      return quals;
    } catch (err) {
      //   console.log(err.message);
      return null;
    }
  }
}

export default ParserJoin;
