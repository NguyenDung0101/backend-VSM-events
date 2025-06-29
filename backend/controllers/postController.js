const Post = require('../models/Post');

// Tạo bài viết
exports.createPost = async (req, res) => {
  try {
    const { title, shortDescription, content, tags, category, thumbnail } = req.body;

    const thumbnailUrl = req.file
      ? `/uploads/${req.file.filename}`
      : thumbnail; // Lấy từ req.body nếu không upload file

    if (!thumbnailUrl) {
      return res.status(400).json({ error: 'Thumbnail is required' });
    }

    const author = req.user.name || "Anonymous";

    const post = await Post.create({
      title,
      thumbnail: thumbnailUrl,
      shortDescription,
      content,
      tags: tags?.split(',') || [],
      category,
      author
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Cập nhật bài viết
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.thumbnail = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true });

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy bài viết theo người dùng
exports.getPostsByAuthor = async (req, res) => {
  try {
    const author = req.params.name;
    const posts = await Post.find({ author });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy bài viết theo ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

