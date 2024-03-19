class ApiQuerySearchHandler {
    constructor(model, queryObj) {
        this.model = model;
        this.queryObj = queryObj;
    }

    //GET: http://localhost:9000/[resource-name]?[query-string]
    // product example exactly cost 1190: http://localhost:9000/products?price=1190
    // product example more than 1800: http://localhost:9000/products?price[gte]=1800
    // product example less than 1800:  http://localhost:9000/products?price[lte]=1800


    filterDocs() {
        let queryObjCopy = { ...this.queryObj };
        let excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObjCopy[el]);

        let queryStr = JSON.stringify(queryObjCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (el) => `$${el}`);

        this.model = this.model.find(JSON.parse(queryStr));

        return this;
    }

    //GET: http://localhost:9000/[resource-name]?sort=[critiria]
    // product example: http://localhost:9000/products?collection=summer

    sortDocs() {
        if (this.queryObj.sort) {
            const criteria = this.queryObj.sort.split(",").join(" ");
            this.model = this.model.sort(criteria);
        }
        return this;
    }

    //GET: http://localhost:9000/[resource-name]?field=[field-name]
    // product example: http://localhost:9000/products?fields=name,img,price

    limitFields() {
        if (this.queryObj.fields) {
            const fields = this.queryObj.fields.split(",").join(" ");
            this.model = this.model.select(fields);
        } else {
            this.model = this.model.select("-__v");
        }
        return this;
    }
}

export default ApiQuerySearchHandler;

  