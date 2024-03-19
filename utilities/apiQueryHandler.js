class ApiQueryHandler {
  constructor(model, queryObj) {
    this.model = model;
    this.queryObj = queryObj;
  }
   
  //GET: http://localhost:9000/[resource-name]?page=[page-number]&limit=[number-of-docs]
  // example: http://localhost:9000/products?page=2&limit=5

  paginateDocs() {
    if (this.queryObj.page && this.queryObj.limit) {
      const page = this.queryObj.page * 1 || 1;
      const limit = this.queryObj.limit * 1 || 6;
      const skip = (page - 1) * limit;
      this.model = this.model.skip(skip).limit(limit);
    }
    return this;
  }

  //GET: http://localhost:9000/products?category=[critiria]
  // product example: http://localhost:9000/products?summer

  categoryDocs() {
    if (this.queryObj.category) {
      const categories = this.queryObj.category.split(",");
      const criteria = categories.join(" ");
      
     
      const categoryQuery = ["man", "women", "gifts"].includes(criteria)
        ? { gender: criteria }
        : { category: { $in: categories } };
      console.log(categoryQuery)
      
      this.model = this.model.find(categoryQuery);
    }
    return this;
  }

  // categoryDocs() {
  //   if (this.queryObj.category) {
  //     const categories = this.queryObj.category.split(",");
  //     const categoryQueries = categories.map(category => {
  //       return ["man", "women", "gifts"].includes(category)
  //         ? { gender: category }
  //         : { category };
  //     });

  //     const mergedCategoryQuery = { $or: categoryQueries };
  //     this.model = this.model.find(mergedCategoryQuery);
  //   }
  //   return this;
  // }
}

export default ApiQueryHandler;

