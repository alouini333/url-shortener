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

app.get('/:slug', async (req, res, next) => {
    const { slug } = req.params;
    const { url } = await Url.findOne({ slug });
    if (url) {
        res.redirect(url);
    }
    res.redirect('/');
});


app.post('/', async (req, res, next) => {
    try {
        let { slug, url } = req.body;
        if (slug) {
            const existingUrl = await Url.findOne({slug});
            if (existingUrl) {
                res.json({
                    status: 'fail',
                    mmessage: 'Slug aleady in use'
                });
            }
        } else  {
            slug = nanoid(7);
        }
        const insertedUrl = await new Url({url, slug}).save();
        console.log("Hello");
        res.json(
            insertedUrl
        );
    
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
})

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
