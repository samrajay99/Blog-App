const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const {postModel} = require('../models/postModel');
const { userModel } = require('../models/userModel');

const createPost = async (req, res) => {
  try {
      const { title, category, description} = req.body;
      if (!req.files){
        return res.status(422).json({error: "Thumbnail is required"});
      }

      const{ thumbnail } = req.files;

      if (!title || !category || !description||!thumbnail){
        return res.status(422).json({error: "All fields are required and choose thumbnail"});
      }
      if(thumbnail.size > 1024 * 1024) {
        return res.status(422).json({error: "Thumbnail size should be less than 1MB"});
      };
      let fileName=thumbnail.name;
      let splittedName = fileName.split('.');
      let newFileName = splittedName[0] + uuid() + '.' + splittedName[splittedName.length - 1];
      thumbnail.mv(path.join(__dirname, '../uploads', newFileName), async (err) => {
        if (err) {
          return res.status(422).json({error: "Thumbnail upload failed"});
        }else{
          const newPost=await postModel.create({title, category, description, creator: req.user._id, thumbnail: newFileName});
          const  currentUser = await userModel.findById(req.user._id);
          const userPostCount = currentUser.posts.length + 1;
          await userModel.findByIdAndUpdate(req.user._id, { posts: userPostCount }, { new: true });
          return res.status(201).json(newPost)
        }

      });
  } catch (error) {
     //console.error("Error creating post:", error);
      return res.status(422).json({error: "Post Creation Failed"});
    
  }
};

const getPosts = async (req, res) => {
  try {
    const posts=await postModel.find().sort({updatedAt:-1});
    return res.status(200).json(posts);
  } catch (error) {
    //console.error("Error fetching posts:", error);
    return res.status(422).json({error: "Failed to fetch posts"});
  }
};

const getPost= async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({error: "Post not found"});
    }
    return res.status(200).json(post);
  } catch (error) {
    //console.error("Error fetching post:", error);
    return res.status(422).json({error: "Failed to fetch post"});
  }
};

const getCategoryPosts = async (req, res) => {
  try {
   const category = req.params.category;
   const posts = await postModel.find({ category }).sort({updatedAt:-1});
    if (!posts) {
      return res.status(404).json({error: "No posts found for this category"});
    }
    return res.status(200).json(posts);
  } catch (error) {
    //console.error("Error fetching category posts:", error);
    return res.status(422).json({error: "Failed to fetch category posts"});
  }
};


const getUserPosts = async (req, res) => {
  try {
      const userId = req.params.id;
      const posts = await postModel.find({ creator: userId }).sort({updatedAt:-1});
      if (!posts || posts.length === 0) {
        return res.status(404).json({error: "No posts found for this user"});
      }
      return res.status(200).json(posts);
    
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return res.status(422).json({error: "Failed to fetch user posts"});
  }
};

const editPost = async (req, res) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;
    const postId= req.body;
    const { title, category, description } = req.body;
    if (!title || !category || !description.length<12) {
      return res.status(422).json({error: "All fields are required"});
    }
    if(!req.files){
     updatedPost= await postModel.findByIdAndUpdate(postId, { title, category, description }, { new: true });
    }else{
      //get old post from db
      const oldPost = await postModel.findById(postId);
      // delete the old thumbnail file if it exists
      fs.unlink(__dirname + '/../uploads/' + oldPost.thumbnail, (err) => {
        if (err) {
          return res.status(422).json({error: "Failed to delete old thumbnail file"});
        }
      });
      const { thumbnail } = req.files;
      if (thumbnail.size > 1024 * 1024) {
        return res.status(422).json({error: "Thumbnail size should be less than 1MB"});
      }
      fileName = thumbnail.name;
      let splittedFileName = fileName.split('.');
      newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];
      thumbnail.mv(path.join(__dirname, '../uploads', newFileName), async (err) => {
        if (err) {
          return res.status(422).json({error: "Thumbnail upload failed"});
        }
        updatedPost=await postModel.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFileName }, { new: true });
      });
    }
    if (!updatedPost) {
      return res.status(404).json({error: "Post not found"});
    }
    return res.status(200).json(updatedPost);
  } catch (error) {
   // console.error("Error editing post:", error);
    return res.status(422).json({error: "Failed to edit post"});
  }
};

const deletePost = async (req, res) => {
  try {
   const postId = req.params.id;
   if (!postId) {
     return res.status(422).json({error: "Post ID is required"});
   }
   const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({error: "Post not found"});
    }
    const fileName = post.thumbnail;
    if(req.user.id==post.creator){
      fs.unlink(path.join(__dirname, '../uploads', fileName), async (err) => {
        if (err) {
          return res.status(422).json({error: "Failed to delete thumbnail file"});
        }else{
          await postModel.findByIdAndDelete(postId);
          const currentUser = await userModel.findById(req.user.id);
          const userPostCount = currentUser.posts.length - 1;
          await userModel.findByIdAndUpdate(req.user.id, { posts: userPostCount }, { new: true });
          return res.status(200).json({message: "Post deleted successfully"});
        }
          
      });
    }
  } catch (error) {
    //console.error("Error deleting post:", error);
    return res.status(422).json({error: "Failed to delete post"});
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCategoryPosts,
  getUserPosts,
  editPost,
  deletePost
}