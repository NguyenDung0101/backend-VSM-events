const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth'); // xác thực JWT

// Tạo bài viết (user hoặc admin)
router.post('/', authMiddleware, upload.single('thumbnail'), postController.createPost);


// Lấy bài viết theo id
router.get("/:id", authMiddleware, postController.getPostById);

// Cập nhật bài viết
router.put('/:id', authMiddleware, upload.single('thumbnail'), postController.updatePost);

// Xóa bài viết
router.delete('/:id', authMiddleware, postController.deletePost);

// Lấy tất cả bài viết
router.get('/', postController.getAllPosts);

// Lấy bài viết theo tên tác giả
router.get('/author/:name', postController.getPostsByAuthor);

module.exports = router;
