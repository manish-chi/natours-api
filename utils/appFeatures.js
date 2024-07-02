class AppFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    let excludedList = ["limit", "field", "page", "sort"];
    excludedList.forEach((ele) => delete queryObj[ele]);
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(/\b(lt||lte||gte||gt)\b/, (match) => {
      `$${match}`;
    });

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limit() {
    if (this.queryString.limit) {
      this.query = this.query.limit(this.queryString.limit);
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    }
    return this;
  }

  pagination() {
    if (this.queryString.page) {
      let page = this.queryString.page || 1;
      let limit = this.queryString.limit || 100;
      let skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

module.exports = AppFeatures;
