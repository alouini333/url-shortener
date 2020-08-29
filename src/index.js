const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const path = require('path');

const db = require('./db/connection');
const Url = require('./models/Urls');
const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/stats/all', async (req, res, next) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    next(error);
  }
});

app.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const foundUrl = await Url.findOne({ slug });
    if (foundUrl) {
      const { url } = foundUrl;
      foundUrl.numberOfClicks += 1;
      foundUrl.save();
      res.redirect(url);
    }
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

app.post('/', async (req, res, next) => {
  try {
    let { slug, url } = req.body;
    if (slug) {
      const existingUrl = await Url.findOne({ slug });
      if (existingUrl) {
        res.json({
          status: 'fail',
          mmessage: 'Slug aleady in use',
        });
      }
    } else {
      slug = nanoid(7);
    }
    const insertedUrl = await new Url({ url, slug }).save();
    res.json(insertedUrl);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
