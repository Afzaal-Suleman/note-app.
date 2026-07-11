const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  favorite: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Note', noteSchema);
