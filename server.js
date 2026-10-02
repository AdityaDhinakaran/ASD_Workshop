const app = require('./app');

const port = Number(process.env.PORT) || 3099;
app.listen(port, () => console.log(`Products API listening on port ${port}`));
