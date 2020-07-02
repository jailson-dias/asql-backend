class ParseBasicValues {
  rangeVar(rangeVar) {
    let tableObject = {
      tableName: rangeVar.relname,
    };

    if (rangeVar.schemaname) {
      tableObject.tableName = `${rangeVar.schemaname}.${rangeVar.relname}`;
    }

    if (rangeVar.alias) {
      tableObject.asName = rangeVar.alias.Alias.aliasname;
    }

    return tableObject;
  }

  columnRef(columns) {
    // console.log('cc', columns);
    return columns.fields
      .map((field) => {
        if (field.A_Star) {
          return '*';
        }
        return field.String.str;
      })
      .join('.');
  }

  aConst(aconst) {
    let val = aconst.val;
    if (val.Integer) {
      return val.Integer.ival;
    }

    return val.String.str;
  }
}

export default ParseBasicValues;
