const database = require('../database/productDatabase');

async function listProducts() {
  return database.readProducts();
}

async function getProduct(id) {
  const products = await database.readProducts();
  return products.find((product) => product.id === id) || null;
}

async function createProduct(input) {
  const products = await database.readProducts();
  const product = { id: nextId(products), ...input };
  products.push(product);
  await database.writeProducts(products);
  return product;
}

async function replaceProduct(id, input) {
  const products = await database.readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  const product = { id, ...input };
  products[index] = product;
  await database.writeProducts(products);
  return product;
}

async function patchProduct(id, changes) {
  const products = await database.readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  const product = { ...products[index], ...changes, id };
  products[index] = product;
  await database.writeProducts(products);
  return product;
}

async function deleteProduct(id) {
  const products = await database.readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  await database.writeProducts(products);
  return true;
}

function nextId(products) {
  return products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
}

module.exports = { listProducts, getProduct, createProduct, replaceProduct, patchProduct, deleteProduct };
