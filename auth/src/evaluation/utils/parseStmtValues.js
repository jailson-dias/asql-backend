import { parse } from 'pg-query-parser';
import ParseBasicValues from './parseBasicValues';

import ParserSelect from '../parser/parserSelect';
import ParserDistinct from '../parser/parserDistinct';
import ParserJoin from '../parser/parserJoin';
import ParserWhere from '../parser/parserWhere';
import ParserFrom from '../parser/parserFrom';
import ParserInto from '../parser/parserInto';
import ParserOrder from '../parser/parserOrder';
import ParserGroup from '../parser/parserGroup';
import ParserHaving from '../parser/parserHaving';

class ParseStmtValues {
  constructor() {
    this.baseParser = new ParseBasicValues();
  }

  getStmt(query) {
    let stmt = query || {};

    if (typeof query == 'string') {
      let parsed = parse(query);
      // console.log(parsed);
      if (parsed.error) {
        console.log('error parsing the query:', parsed.error.message);
      }
      stmt = parsed.query;
    }

    if (stmt[0]) {
      stmt = stmt[0];
    } else if (!stmt.SelectStmt) {
      throw new Error("This isn't a select stmt");
    }
    if (!stmt.SelectStmt) {
      throw new Error("This isn't a select stmt");
    }

    return stmt.SelectStmt;
  }

  subselect(rangeSubselect) {
    return {
      subselect: rangeSubselect.alias.Alias.aliasname,
      query: this.query(rangeSubselect.subquery),
    };
  }

  expr(expr) {
    if (expr.ColumnRef) {
      return this.baseParser.columnRef(expr.ColumnRef);
    }

    // console.log('expr', expr);
    if (expr.A_Const) {
      return this.baseParser.aConst(expr.A_Const);
    }

    if (expr.NullTest) {
      return this.nullE(expr.NullTest);
    }

    if (expr.FuncCall) {
      return this.functionCall(expr.FuncCall);
    }

    if (expr.A_Expr) {
      return this.aExpr(expr.A_Expr);
    }

    if (expr.BoolExpr) {
      return this.boolExpr(expr.BoolExpr);
    }

    if (expr.SubLink) {
      return this.sublink(expr.SubLink);
    }

    if (expr.RangeVar) {
      return this.baseParser.rangeVar(expr.RangeVar);
    }

    if (expr.RangeSubselect) {
      return this.subselect(expr.RangeSubselect);
    }

    if (expr[0]) {
      return expr.map((item) => this.expr(item));
    }

    return expr;
  }

  aExpr(aExpr) {
    let name = aExpr.name.map((key) => key.String.str).join(' ');

    let left = this.expr(aExpr.lexpr);
    // console.log('left', left);
    let right = this.expr(aExpr.rexpr);
    // console.log('right', right);

    return {
      name,
      left,
      right,
    };
  }

  nullE(nullExpr) {
    // console.log(nullExpr);
    let column = this.expr(nullExpr.arg);
    let nullType = nullExpr.nulltesttype;

    return {
      column,
      nullType,
    };
  }

  functionCall(func) {
    let name = func.funcname.map((field) => field.String.str).join('.');

    let funcData = {
      name,
    };

    if (func.agg_star) {
      funcData['star'] = '*';
    }

    if (func.agg_distinct) {
      funcData['distinct'] = 'DISTINCT ';
    }

    if (func.args) {
      // console.log(func);
      funcData['args'] = func.args.map((column) => {
        // console.log(column);
        return this.expr(column);
      });
    }

    return funcData;
  }

  boolExpr(expr) {
    return {
      booltype: expr.boolop,
      args: expr.args.map((item) => this.expr(item)),
    };
  }

  // callRightFunc(quals) {
  //   if (!quals) {
  //     return [];
  //   }
  //   // console.log(quals);
  //   if (quals.BoolExpr) {
  //     this.boolExpr(quals.BoolExpr);
  //     // let expressions = quals.BoolExpr.args
  //     //   .map((expr) => this.getQuals(expr))
  //     //   .flat();

  //     // let boolop = {
  //     //   boolop: quals.BoolExpr.boolop,
  //     // };

  //     // let firstExpressions = expressions.slice(0, -1);
  //     // let lastExpression = expressions[expressions.length - 1];
  //     // return [...firstExpressions, boolop, lastExpression];
  //   } else if (quals.NullTest) {
  //     return this.nullE(quals.NullTest);
  //   } else if (quals.SubLink) {
  //     return this.sublink(quals.SubLink);
  //   } else if (quals.A_Expr) {
  //     return this.aExpr(quals.A_Expr);
  //   }

  //   return quals;
  // }

  sublink(sublink) {
    return {
      subLinkType: sublink.subLinkType,
      query: this.query(sublink.subselect),
    };
  }

  query(select) {
    const parseSelect = new ParserSelect(select);
    const parseJoin = new ParserJoin(select);
    const parseDistinct = new ParserDistinct(select);
    const parserFrom = new ParserFrom(select);
    const parseWhere = new ParserWhere(select);
    const parseInto = new ParserInto(select);
    const parseOrder = new ParserOrder(select);
    const parseGroup = new ParserGroup(select);
    const parseHaving = new ParserHaving(select);

    return {
      select: parseSelect.parseSelect(),
      into: parseInto.parseInto(),
      from: parserFrom.parseTableName(),
      distinct: parseDistinct.parseDistinct(),
      where: parseWhere.parseWhere(),
      order: parseOrder.parseOrder(),
      group: parseGroup.parserGroup(),
      having: parseHaving.parserHaving(),
      join: {
        join: parseJoin.parseJoin(),
        inner: parseJoin.parseInner(),
        cross: parseJoin.parseCross(),
        leftOuter: parseJoin.parseLeftOuter(),
        rightOuter: parseJoin.parseRightOuter(),
        fullOuter: parseJoin.parseFullOuter(),
      },
    };
  }

  caseWhen(cWhen) {
    // console.log(cWhen);
    return {
      expr: this.expr(cWhen.expr),
      result: this.expr(cWhen.result),
    };
  }

  caseExpr(expr) {
    // console.log(expr.defresult);
    return {
      args: expr.args.map((arg) => this.caseWhen(arg.CaseWhen)),
      defresult: this.expr(expr.defresult),
    };
  }
}

export default ParseStmtValues;
