export function fetchProductById(id) {
  //TODO: we will not hard-code server URL here
  return new Promise(async (resolve) => {
    const response = await fetch(" http://localhost:8080/products/" + id);
    const data = await response.json();
    resolve({ data });
  });
}
export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch(" http://localhost:8080/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchProductsByFilters(filter, sort, pagination, admin) {
  //filter={"category":"smartphone"}
  //TODO:on server we will support ,multiple filters vales
  //TODO:on server will suport multi values in filter
  //TODO: Sever will filter deleted products in case of non-admin;
  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.filter) {
      const lastCategoryValues = categoryValues[categoryValues.length - 1];
      queryString += `${key}=${lastCategoryValues}&`;
    }
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }
  //TODO: we will not hard-code server URL here
  if (admin) {
    queryString += `admin=true`;
  }
  return new Promise(async (resolve) => {
    // http://localhost:8080/products?category=laptops
    const response = await fetch(
      " http://localhost:8080/products?" + queryString
    );
    const data = await response.json();
    const totalItems = await response.headers.get("X-Total-Count");
    resolve({ data: { products: data, totalItems: +totalItems } });
  });
}
export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      "http://localhost:8080/products/" + update.id,
      {
        method: "PATCH",
        body: JSON.stringify(update),
        headers: { "content-type": "application/json" },
      }
    );
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchCategories() {
  return new Promise(async (resolve) => {
    const response = await fetch(" http://localhost:8080/categories");
    const data = await response.json();
    resolve({ data });
  });
}
export function fetchBrands() {
  return new Promise(async (resolve) => {
    const response = await fetch(" http://localhost:8080/brands");
    const data = await response.json();
    resolve({ data });
  });
}
