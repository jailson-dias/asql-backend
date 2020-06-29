const parser = require('pg-query-parser');

class ParserTarget {
  constructor(query) {
    let parsed = parser.parse(query);
    if (parsed.error) {
      console.log('error parsing the query:', parsed.error.message);
    }
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

  parseFunctionCall(func) {
    let name = func.funcname.map((field) => field.String.str).join('.');

    let args = '';

    if (func.agg_star) {
      args = '*';
    }

    if (func.agg_distinct) {
      args = 'DISTINCT ';
    }

    if (func.args) {
      let columns = func.args.map((column) =>
        this.parseColumnRef(column.ColumnRef.fields)
      );
      args += columns.join(', ');
    }

    return `${name}(${args})`;
  }

  parseTarget(target) {
    if (!target) {
      return null;
    }
    let name = '';
    if (target.ResTarget.name) {
      name = ' as ' + target.ResTarget.name;
    }
    let val = target.ResTarget.val;

    if (val.ColumnRef) {
      return this.parseColumnRef(target.ResTarget.val.ColumnRef.fields) + name;
    } else if (val.FuncCall) {
      return this.parseFunctionCall(val.FuncCall) + name;
    }
  }

  getTargetList() {
    let targetList = this.query || {};
    if (!targetList[0]) {
      throw new Error("This isn't a target");
    }
    targetList = targetList[0];
    if (!targetList.SelectStmt) {
      throw new Error("This isn't a target");
    }
    targetList = targetList.SelectStmt;
    if (!targetList.targetList) {
      throw new Error("This isn't a target");
    }

    // console.log(targetList);
    return targetList.targetList;
  }

  parseTargetList() {
    try {
      let targetList = this.getTargetList();
      return targetList.map((target) => this.parseTarget(target));
    } catch (err) {
      // console.log(err.message);
      return null;
    }
  }
}

export default ParserTarget;
