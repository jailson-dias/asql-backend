const parser = require('pg-query-parser');

class ParserDistinct {
  constructor(query) {
    let parsed = parser.parse(query);
    if (parsed.error) {
      console.log('error parsing the query:', parsed.error.message);
    }
    this.query = parsed.query;
  }

  getDistinct() {
    let distinctList = this.query || {};

    if (!distinctList[0]) {
      throw new Error("This isn't a distinct clause");
    }
    distinctList = distinctList[0];

    if (!distinctList.SelectStmt) {
      throw new Error("This isn't a distinct clause");
    }
    distinctList = distinctList.SelectStmt;

    if (!distinctList.distinctClause) {
      throw new Error("This isn't a distinct clause");
    }

    // console.log(distinctList.fromClause);
    return distinctList.distinctClause;
  }

  parseDistinct() {
    try {
      return this.getDistinct();
    } catch (err) {
      // console.log(err.message);
      return null;
    }
  }
}

export default ParserDistinct;
