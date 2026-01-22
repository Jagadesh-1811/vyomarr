const BlogPost = require('../models/BlogPost');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Create a new blog post
const createPost = async (req, res) => {
  try {
    // Handle thumbnail upload
    let thumbnailData = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      const thumbnailResult = await uploadToCloudinary(req.files.thumbnail[0].buffer);
      thumbnailData = {
        url: thumbnailResult.secure_url,
        publicId: thumbnailResult.public_id
      };
    }

    // Handle gallery images
    const imageFiles = (req.files && req.files.images) || [];
    const imageUrls = [];

    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(file => uploadToCloudinary(file.buffer));
      const uploadResults = await Promise.all(uploadPromises);

      uploadResults.forEach(result => {
        imageUrls.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      });
    }

    const newPost = new BlogPost({
      category: req.body.category,
      subCategory: req.body.subCategory,
      title: req.body.title,
      subHeading: req.body.subHeading,
      content: req.body.content,
      youtubeEmbed: req.body.youtubeEmbed,
      thumbnail: thumbnailData,
      images: imageUrls
    });

    await newPost.save();
    res.status(201).json({ success: true, message: 'Blog post created!', data: newPost });
  } catch (error) {
    console.error('Error uploading post:', error);
    res.status(500).json({ error: 'Server Error during upload' });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch posts' });
  }
};

// Get a single post by ID (also increments view count)
const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch post' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Delete thumbnail from Cloudinary
    if (post.thumbnail && post.thumbnail.publicId) {
      await deleteFromCloudinary(post.thumbnail.publicId);
    }

    // Delete gallery images from Cloudinary
    const deletePromises = post.images.map(img => deleteFromCloudinary(img.publicId));
    await Promise.all(deletePromises);

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: 'Could not like post' });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and text are required' });
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { name, text, createdAt: new Date() } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: 'Could not add comment' });
  }
};

// Get all comments from all posts
const getAllComments = async (req, res) => {
  try {
    const posts = await BlogPost.find({ 'comments.0': { $exists: true } })
      .select('title comments')
      .sort({ createdAt: -1 });
    
    const allComments = [];
    posts.forEach(post => {
      post.comments.forEach(comment => {
        allComments.push({
          _id: comment._id,
          postId: post._id,
          articleTitle: post.title,
          name: comment.name,
          text: comment.text,
          createdAt: comment.createdAt
        });
      });
    });
    
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Could not fetch comments' });
  }
};

// Delete a comment from a post
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    
    const post = await BlogPost.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Could not delete comment' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  getAllComments,
  deleteComment
};
