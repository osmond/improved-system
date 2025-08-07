const express = require('express');
const cors = require('cors');
const kindleRouter = require('./api/kindle');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/kindle', kindleRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
