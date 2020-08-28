const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlEntrySchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    min: 7,
    unique: true,
    required: true,
  },
  numberOfClicks: {
    type: Number,
    default: 0,
    required: true,
  },
});

const UrlEntry = mongoose.model('UrlEntry', urlEntrySchema);

module.exports = UrlEntry;
