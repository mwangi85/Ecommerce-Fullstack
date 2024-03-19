import successHandler from "../middlewares/successHandler.js";
import Product from "../models/productModel.js";
import ApiQueryHandler from "../utilities/apiQueryHandler.js";
// import ApiQuerySearchHandler from "../utilities/apiQuerySearchHandler.js";


//GET: http://localhost:9000/products
//for a specific call: http://localhost:9000/products/men&page=1&limit=6

export const getAllProducts = async (req, res, next) => {
  try {

    let apiQuery = new ApiQueryHandler(Product, req.query) 
      .paginateDocs()
      .categoryDocs();
    const products = await apiQuery.model;

    console.log(req.query);
    //console.log(products)
    successHandler(res, 200, products);
    
  } catch (error) {
    next(error);
  }
};


export const getSomeProducts = async (req, res, next) => {
  try {

    let apiQuerySearch = new ApiQuerySearchHandler(Product, req.query)
      .filterDocs()
      .sortDocs()
      .limitFields()
      .paginateDocs();

    const products = await apiQuerySearch.model;
    //console.log(products);
    successHandler(res, 200, products);
  } catch (error) {
    next(error);
  }
};



//GET: http://localhost:9000/products/the_id_product_in_MongoDB
// Non functional

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    successHandler(res, 200, product);
  } catch (error) {
    next(error);
  }
};

