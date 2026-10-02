const products = require('../services/productService');

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const parseId = (req) => Number.parseInt(req.params.id, 10);

const list = asyncHandler(async (req, res) => res.json(await products.listProducts()));

const get = asyncHandler(async (req, res) => {
  const product = await products.getProduct(parseId(req));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

const create = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
    return res.status(400).json({ error: 'A product name is required' });
  }
  const product = await products.createProduct(req.body);
  return res.status(201).json(product);
});

const replace = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
    return res.status(400).json({ error: 'A product name is required' });
  }
  const product = await products.replaceProduct(parseId(req), req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

const patch = asyncHandler(async (req, res) => {
  const product = await products.patchProduct(parseId(req), req.body || {});
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
});

const remove = asyncHandler(async (req, res) => {
  const deleted = await products.deleteProduct(parseId(req));
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  return res.status(204).end();
});

module.exports = { list, get, create, replace, patch, remove };
