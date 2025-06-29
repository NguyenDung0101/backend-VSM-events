const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  publishedAt: { type: Date, default: Date.now },
  author: { type: String, default: "Admin" },
  tags: { type: [String], default: [] },
  category: { type: String, default: "Uncategorized" },
  isPublished: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);
