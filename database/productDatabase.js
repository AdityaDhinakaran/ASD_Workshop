const fs = require('node:fs/promises');
const path = require('node:path');

const databaseFile = path.join(__dirname, '..', 'db.json');

async function readProducts() {
  const contents = await fs.readFile(databaseFile, 'utf8');
  return JSON.parse(contents);
}

async function writeProducts(products) {
  const temporaryFile = `${databaseFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryFile, databaseFile);
}

module.exports = { readProducts, writeProducts };
