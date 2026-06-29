const {userModel }= require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { error } = require("console");

const register=async (req,res)=>{
try{
   const{ name, email, password,password2 } = req.body;
 if(!name || !email || !password){
   return res.status(400).json({message: "All fields are required"});
 }
  const newEmail = email.toLowerCase();
  const isEmailExists= await userModel.findOne({email:newEmail})
  if(isEmailExists){
    return res.status(422).json({error: "Email already exists"});
  }
  if(password !== password2){
    return res.status(422).json({error: "Passwords do not match"});
  }

  const hashedPassword = await bcrypt.hashSync(password, 10);
  const newUser = userModel.create({name,email: newEmail ,password:hashedPassword,avatar: 'default-avatar.png'});
  return res.status(201).json({ message: "User registered successfully"});

} catch(error){
  console.error("Error during registration:", error);
  return res.status(500).json({error: "User Registration Failed"});
 }
}


const login=async (req,res)=>{
 try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({error: "Email and password are required"});
    }

    const newEmail = email.toLowerCase();
    const isUser = await userModel.findOne({email: newEmail});
    //console.log(isUser);
    if (!isUser) {
      return res.status(422).json({error: "Invalid email or password"});
    }
    const isPasswordMatch = bcrypt.compareSync(password, isUser.password);
    if (!isPasswordMatch) {
      return res.status(422).json({error: "Invalid email or password"});
    }
    const jwtkey = process.env.JWT_KEY;
    const token = jwt.sign({ id: isUser._id ,name:isUser.name}, jwtkey, { expiresIn: '1d' });

    return res.status(200).json({token,id:isUser._id,name:isUser.name})
     

 } catch (error) {
  console.error("Error during login:", error);
  return res.status(422).json({error: "User Login Failed"});
 }
}


const getUser=async (req,res)=>{
 try {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    if (!user) {
      return res.status(422).json({error: "User not found"});
    }
    return res.status(200).json(user)
      
 } catch (error) {
  console.error("Error fetching user:", error);
  return res.status(422).json({error: "Failed to fetch user"});
 }
}


const changeAvtar= async (req,res)=>{
    try {
      //console.log("File:", req.files);

      if (!req.files || !req.files.avatar) {
        return res.status(422).json({error: "No file uploaded"});
      };

      // find the user by ID from DB
      const user= await userModel.findById(req.user.id);

      // delete the old avatar file if it exists
      if(user.avatar){
        fs.unlink(path.join(__dirname, '../uploads', user.avatar), (err) => {
          if (err) {
            return res.status(422).json({
              error: "Failed to delete old avatar file, please try again later"
            });
          }
        });
      }
      
      const{avatar} = req.files;
      if(avatar.size > 1024 * 1024) {
        return res.status(422).json({error: "File size should be less than 1MB"});
      };

      // change the avatar file name
      let fileName ;
      fileName =avatar.name;
      let splittedFileName=fileName.split('.');
      let newFileName=splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1];


      //console.log("New File Name:", newFileName);
      avatar.mv(path.join(__dirname, '../uploads', newFileName), async (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(422).json({error: "Failed to upload avatar"});
        }
        const updatedAvatar = await userModel.findByIdAndUpdate(req.user.id, { avatar: newFileName }, { new: true});

        if (!updatedAvatar) {
          return res.status(422).json({error: "Failed to update avatar"});
        };
        return res.status(200).json(updatedAvatar);
      }
    );
   } catch (error) {
      console.error("Error changing avatar:", error);
      return res.status(422).json({error: "Failed to change avatar"});
    }
}


const editUser =async(req,res)=>{
  try{
      const{name, email,currentPassword, newPassword, confirmPassword} = req.body;
      if(!name || !email || !currentPassword || !newPassword || !confirmPassword){
        return res.status(422).json({error: "All fields are required"});
      };

      const user =await userModel.findById(req.user.id);
      if(!user){
        return res.status(422).json({error: "User not found"});
      };

      // make sure new email does not already exist

      const emailExists = await userModel.findOne({email: email.toLowerCase()});
      if(emailExists && (emailExists._id != req.user._id)){
        return res.status(422).json({error: "Email already exists"});
      };

      // check if current password is correct

      const validateUserPassword = bcrypt.compareSync(currentPassword, user.password);
      if(!validateUserPassword){
        return res.status(422).json({error: "Current password is incorrect"});
      };

      // check if new password and confirm password match
      if(newPassword !== confirmPassword){
        return res.status(422).json({error: "New password and confirm password do not match"});
      };

      // hash the new password
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      // update user details

      const newInfo = await userModel.findByIdAndUpdate(req.user.id, {
        name,
        email: email.toLowerCase(),
        password: hashedNewPassword
      }, { new: true });
      return res.status(200).json(newInfo)



  }catch(error){
    console.error("Error editing user:", error);
    return res.status(422).json({error: "Failed to edit user"});
}
}


const getAuthors=async (req,res)=>{
    try {
    const author = await userModel.find().select('-password');
    if (!author) {
      return res.status(422).json({error: "Author not found"});
    }
    return res.status(200).json(author)
      
 } catch (error) {
  console.error("Error fetching user:", error);
  return res.status(422).json({error: "Failed to fetch user"});
 }
}


module.exports = {
  register,
  login,
  getUser,
  changeAvtar,
  editUser,
  getAuthors
};